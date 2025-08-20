import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
	type ArticleParams,
} from 'src/constants/articleProps';

import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';
import styles from './ArticleParamsForm.module.scss';

// нормализуем value из Select/Radio
const toValue = (v: any): string =>
	typeof v === 'string' ? v : v?.target?.value ?? v?.value ?? '';

// находим опцию по строковому value (для selected)
const pickOption = <T extends { value: string }>(list: T[], value: string): T =>
	list.find((o) => o.value === value) ?? list[0];

type Props = {
	appliedParams: ArticleParams; // плоские строки
	onApply: (next: ArticleParams) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	appliedParams,
	onApply,
	onReset,
}: Props) => {
	// открыт/закрыт сайдбар
	const [open, setOpen] = useState(false);

	// локальный черновик
	const [draft, setDraft] = useState<ArticleParams>(appliedParams);

	// клик-вне
	const rootRef = useRef<HTMLDivElement>(null);
	useOutsideClickClose({ isOpen: open, rootRef, onChange: setOpen });

	// синхронизация при внешнем применении/сбросе
	useEffect(() => setDraft(appliedParams), [appliedParams]);

	// обновление одного поля черновика
	const setField = useCallback(
		<K extends keyof ArticleParams>(key: K, value: ArticleParams[K]) => {
			setDraft((prev) =>
				prev[key] === value ? prev : { ...prev, [key]: value }
			);
		},
		[]
	);

	// onChange для контролов
	const handlers = useMemo(
		() => ({
			fontFamily: (v: unknown) => setField('fontFamily', toValue(v)),
			fontSize: (v: unknown) => setField('fontSize', toValue(v)),
			fontColor: (v: unknown) => setField('fontColor', toValue(v)),
			background: (v: unknown) => setField('bgColor', toValue(v)),
			width: (v: unknown) => setField('contentWidth', toValue(v)),
		}),
		[setField]
	);

	// кнопки (НЕ submit)
	const handleApplyClick = useCallback(() => {
		onApply(draft);
		setOpen(false);
	}, [onApply, draft]);

	const handleResetClick = useCallback(() => {
		onReset();
		setOpen(false);
	}, [onReset]);

	return (
		<div ref={rootRef}>
			<ArrowButton isOpen={open} onClick={() => setOpen((v) => !v)} />

			<aside
				className={clsx(styles.container, { [styles.container_open]: open })}>
				{/* без <form>, чтобы не было нативного submit */}
				<div className={styles.form} role='form'>
					<header className={styles.title}>
						<Text as='h2' size={31} weight={800} uppercase>
							Задайте параметры
						</Text>
					</header>

					{/* Шрифт */}
					<section className={styles.section}>
						<Select
							title='Шрифт'
							selected={pickOption(fontFamilyOptions, draft.fontFamily)}
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
							selected={pickOption(fontSizeOptions, draft.fontSize)}
							onChange={handlers.fontSize}
						/>
					</section>

					{/* Цвет текста */}
					<section className={styles.section}>
						<Select
							title='Цвет текста'
							selected={pickOption(fontColors, draft.fontColor)}
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
							selected={pickOption(backgroundColors, draft.bgColor)}
							options={backgroundColors}
							placeholder='Выберите цвет фона'
							onChange={handlers.background}
						/>
					</section>

					{/* Ширина контента */}
					<section className={styles.section}>
						<Select
							title='Ширина контента'
							selected={pickOption(contentWidthArr, draft.contentWidth)}
							options={contentWidthArr}
							placeholder='Выберите ширину'
							onChange={handlers.width}
						/>
					</section>

					<footer className={styles.bottomContainer}>
						{/* наши Button должны рендерить <button type="button"> по умолчанию */}
						<Button title='Сбросить' type='clear' onClick={handleResetClick} />
						<Button title='Применить' type='apply' onClick={handleApplyClick} />
					</footer>
				</div>
			</aside>
		</div>
	);
};
