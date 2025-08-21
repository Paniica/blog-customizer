import { useEffect, RefObject } from 'react';

type Options = {
	isOpen: boolean;
	rootRef: RefObject<HTMLElement>;
	onChange: (open: boolean) => void;
};

export function useOutsideClickClose({ isOpen, rootRef, onChange }: Options) {
	useEffect(() => {
		// форма закрыта — ничего не делаем
		if (!isOpen) return;

		const root = rootRef.current;

		const handlePointerDown = (e: PointerEvent) => {
			const target = e.target as Node | null;
			if (root && target && !root.contains(target)) {
				onChange(false);
			}
		};

		// pointerdown покрывает мышь и тач; capture=true на случай stopPropagation внутри
		document.addEventListener('pointerdown', handlePointerDown, true);

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown, true);
		};
	}, [isOpen, rootRef, onChange]);
}
