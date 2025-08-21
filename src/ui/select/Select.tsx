import { useState, useRef, useEffect } from 'react';
import type { MouseEventHandler } from 'react';
import clsx from 'clsx';
import { OptionType } from 'src/constants/articleProps';
import { Text } from 'src/ui/text';
import arrowDown from 'src/images/arrow-down.svg';
import { Option } from './Option';
import { isFontFamilyClass } from './helpers/isFontFamilyClass';
import { useEnterSubmit } from './hooks/useEnterSubmit';
import { useOutsideClickClose } from './hooks/useOutsideClickClose';

import styles from './Select.module.scss';

type SelectProps = {
	selected: OptionType | null;
	options: OptionType[];
	placeholder?: string;
	onChange?: (selected: OptionType) => void;
	/** Коллбэк, когда дропдаун ЗАКРЫТ (клик-вне/Enter/выбор/повторный клик по placeholder) */
	onClose?: () => void;
	title?: string;
};

export const Select = (props: SelectProps) => {
	const { options, placeholder, selected, onChange, onClose, title } = props;

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const placeholderRef = useRef<HTMLDivElement>(null);
	const optionClassName = selected?.optionClassName ?? '';

	// Закрытие по клику-вне — хук навешивает слушатель ТОЛЬКО когда открыто
	useOutsideClickClose({
		isOpen,
		rootRef,
		onChange: setIsOpen,
	});

	// Закрытие по Enter (поведение проекта) — тоже ждёт Dispatch
	useEnterSubmit({
		placeholderRef,
		onChange: setIsOpen,
	});

	// Сообщаем наружу о закрытии тогда и только тогда, когда состояние стало закрытым
	const wasOpenRef = useRef(isOpen);
	useEffect(() => {
		if (wasOpenRef.current && !isOpen) {
			onClose?.();
		}
		wasOpenRef.current = isOpen;
	}, [isOpen, onClose]);

	const handleOptionClick = (option: OptionType) => {
		setIsOpen(false);
		onChange?.(option);
	};

	const handlePlaceHolderClick: MouseEventHandler<HTMLDivElement> = () => {
		setIsOpen((prev) => !prev);
		// onClose вызовется автоматом из эффекта, когда станет false
	};

	return (
		<div className={styles.container}>
			{title && (
				<Text size={12} weight={800} uppercase>
					{title}
				</Text>
			)}

			<div
				className={styles.selectWrapper}
				ref={rootRef}
				data-is-active={isOpen}
				data-testid='selectWrapper'>
				<img src={arrowDown} alt='иконка стрелочки' className={styles.arrow} />

				<div
					className={clsx(
						styles.placeholder,
						(styles as Record<string, string>)[optionClassName]
					)}
					data-selected={!!selected?.value}
					onClick={handlePlaceHolderClick}
					role='button'
					tabIndex={0}
					ref={placeholderRef}
					aria-expanded={isOpen}>
					<Text
						family={
							isFontFamilyClass(selected?.className)
								? selected?.className
								: undefined
						}>
						{selected?.title || placeholder}
					</Text>
				</div>

				{isOpen && (
					<ul className={styles.select} data-testid='selectDropdown'>
						{options
							.filter((option) => selected?.value !== option.value)
							.map((option) => (
								<Option
									key={option.value}
									option={option}
									onClick={() => handleOptionClick(option)}
								/>
							))}
					</ul>
				)}
			</div>
		</div>
	);
};
