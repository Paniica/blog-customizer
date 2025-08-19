import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEventHandler } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Text } from 'src/ui/text';
import { Separator } from 'src/ui/separator';

import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	ArticleStateType,
} from 'src/constants/articleProps';

import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';
import styles from './ArticleParamsForm.module.scss';

type Props = {
	appliedSettings: ArticleStateType;
	onApply: (next: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	appliedSettings,
	onApply,
	onReset,
}: Props) => {
	// флаг открытия панели
	const [open, setOpen] = useState(false);

	// локальный черновик формы
	const [draft, setDraft] = useState<ArticleStateType>(appliedSettings);

	// корневой контейнер для закрытия по клику вне
	const rootRef = useRef<HTMLDivElement>(null);

	// закрытие по клику вне (переиспользуем готовый хук)
	useOutsideClickClose({
		isOpen: open,
		rootRef,
		onChange: setOpen,
	});

	// при открытии синхронизируем черновик с «применёнными»
	useEffect(() => {
		if (open) setDraft(appliedSettings);
	}, [open, appliedSettings]);

	// универсальный апдейтер поля черновика
	const patchDraft = useCallback(
		<K extends keyof ArticleStateType>(key: K, value: ArticleStateType[K]) => {
			setDraft((prev) =>
				prev[key] === value ? prev : { ...prev, [key]: value }
			);
		},
		[]
	);

	// мемо-обработчики для select/radio — чтобы не создавать функции на каждый рендер
	const handlers = useMemo(
		() => ({
			fontFamily: (opt: ArticleStateType['fontFamilyOption']) =>
				patchDraft('fontFamilyOption', opt),
			fontSize: (opt: ArticleStateType['fontSizeOption']) =>
				patchDraft('fontSizeOption', opt),
			fontColor: (opt: ArticleStateType['fontColor']) =>
				patchDraft('fontColor', opt),
			background: (opt: ArticleStateType['backgroundColor']) =>
				patchDraft('backgroundColor', opt),
			width: (opt: ArticleStateType['contentWidth']) =>
				patchDraft('contentWidth', opt),
		}),
		[patchDraft]
	);

	const toggleOpen = useCallback(() => setOpen((v) => !v), []);

	const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(e) => {
			e.preventDefault();
			onApply(draft);
		},
		[onApply, draft]
	);

	const handleReset: FormEventHandler<HTMLFormElement> = useCallback(
		(e) => {
			e.preventDefault();
			onReset();
		},
		[onReset]
	);

	return (
		<div ref={rootRef}>
			<ArrowButton isOpen={open} onClick={toggleOpen} />

			<aside
				className={clsx(styles.container, {
					[styles.container_open]: open,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<header className={styles.title}>
						<Text as='h2' size={31} weight={800} uppercase>
							Задайте параметры
						</Text>
					</header>

					{/* Шрифт */}
					<section className={styles.section}>
						<Select
							title='Шрифт'
							selected={draft.fontFamilyOption}
							options={fontFamilyOptions}
							placeholder='Выберите шрифт'
							onChange={handlers.fontFamily}
						/>
					</section>

					{/* Размер шрифта */}
					<section className={styles.section}>
						<RadioGroup
							title='Размер шрифта'
							name='font-size'
							options={fontSizeOptions}
							selected={draft.fontSizeOption}
							onChange={handlers.fontSize}
						/>
					</section>

					{/* Цвет текста */}
					<section className={styles.section}>
						<Select
							title='Цвет текста'
							selected={draft.fontColor}
							options={fontColors}
							placeholder='Выберите цвет текста'
							onChange={handlers.fontColor}
						/>
					</section>

					<div className={styles.section}>
						<Separator />
					</div>

					{/* Цвет фона */}
					<section className={styles.section}>
						<Select
							title='Цвет фона'
							selected={draft.backgroundColor}
							options={backgroundColors}
							placeholder='Выберите цвет фона'
							onChange={handlers.background}
						/>
					</section>

					{/* Ширина контента */}
					<section className={styles.section}>
						<Select
							title='Ширина контента'
							selected={draft.contentWidth}
							options={contentWidthArr}
							placeholder='Выберите ширину'
							onChange={handlers.width}
						/>
					</section>

					<footer className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</footer>
				</form>
			</aside>
		</div>
	);
};
