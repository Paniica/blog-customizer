import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';

// ui
import { Select } from 'src/ui/select';
import { Button } from 'src/ui/button';

// данные/типы
import {
	OptionType,
	fontFamilyOptions,
	fontSizeOptions,
	contentWidthArr,
	fontColors,
	backgroundColors,
	defaultArticleState,
	type ArticleStateType,
} from 'src/constants/articleProps';

// плоские параметры, которые поднимаем вверх
export type ArticleParams = {
	fontFamily: string;
	fontSize: string;
	contentWidth: string;
	fontColor: string;
	bgColor: string;
};

type Props = {
	isOpen: boolean; // ← используем для анимации
	onClose: () => void;
	onApply?: (p: ArticleParams) => void;
	onReset?: () => void;
	initialState?: ArticleStateType;
};

export const ArticleParamsForm = ({
	isOpen,
	onClose,
	onApply,
	onReset,
	initialState = defaultArticleState,
}: Props) => {
	const rootRef = useRef<HTMLElement>(null);

	// локальный черновик
	const [draft, setDraft] = useState<ArticleStateType>(initialState);

	// синхроним черновик при новых initialState
	useEffect(() => setDraft(initialState), [initialState]);

	// клик-вне: включаем ТОЛЬКО когда панель открыта и с задержкой в 1 кадр,
	// чтобы не поймать клик, которым её открыли
	useEffect(() => {
		if (!isOpen) return;

		const onDown = (e: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(e.target as Node))
				onClose();
		};

		const raf = requestAnimationFrame(() => {
			document.addEventListener('mousedown', onDown);
		});

		return () => {
			cancelAnimationFrame(raf);
			document.removeEventListener('mousedown', onDown);
		};
	}, [isOpen, onClose]);

	// преобразуем OptionType-состояние в плоские строки
	const toParams = (s: ArticleStateType): ArticleParams => ({
		fontFamily: s.fontFamilyOption.value,
		fontSize: s.fontSizeOption.value,
		contentWidth: s.contentWidth.value,
		fontColor: s.fontColor.value,
		bgColor: s.backgroundColor.value,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply?.(toParams(draft));
		onClose();
	};

	const handleReset = () => {
		setDraft(defaultArticleState);
		onReset?.();
		onClose();
	};

	// удобный сеттер для Select
	const set =
		<K extends keyof ArticleStateType>(key: K) =>
		(opt: OptionType) =>
			setDraft((d) => ({ ...d, [key]: opt }));

	return (
		<aside
			ref={rootRef}
			className={clsx(styles.container, isOpen && styles.container_open)}
			aria-label='Панель параметров'>
			<div className={styles.header}>
				<h3>Задайте параметры</h3>
				<button
					type='button'
					onClick={onClose}
					className={styles.closeBtn}
					aria-label='Закрыть'>
					×
				</button>
			</div>

			<form className={styles.form} onSubmit={handleSubmit}>
				{/* ШРИФТ */}
				<Select
					title='Шрифт'
					placeholder='Выберите шрифт'
					selected={draft.fontFamilyOption}
					options={fontFamilyOptions}
					onChange={set('fontFamilyOption')}
				/>

				{/* РАЗМЕР ШРИФТА */}
				<Select
					title='Размер шрифта'
					placeholder='Выберите размер'
					selected={draft.fontSizeOption}
					options={fontSizeOptions}
					onChange={set('fontSizeOption')}
				/>

				{/* ЦВЕТ ШРИФТА */}
				<Select
					title='Цвет шрифта'
					placeholder='Выберите цвет'
					selected={draft.fontColor}
					options={fontColors}
					onChange={set('fontColor')}
				/>

				{/* ЦВЕТ ФОНА */}
				<Select
					title='Цвет фона'
					placeholder='Выберите цвет'
					selected={draft.backgroundColor}
					options={backgroundColors}
					onChange={set('backgroundColor')}
				/>

				{/* ШИРИНА КОНТЕНТА */}
				<Select
					title='Ширина контента'
					placeholder='Выберите ширину'
					selected={draft.contentWidth}
					options={contentWidthArr}
					onChange={set('contentWidth')}
				/>

				<div className={styles.bottomContainer}>
					<Button
						title='Сбросить'
						htmlType='button'
						type='clear'
						onClick={handleReset}
					/>
					<Button title='Применить' htmlType='submit' type='apply' />
				</div>
			</form>
		</aside>
	);
};
