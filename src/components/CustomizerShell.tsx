import { useEffect, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import {
	ArticleParamsForm,
	type ArticleParams,
} from 'src/components/article-params-form/ArticleParamsForm';

import {
	defaultArticleState,
	type ArticleStateType,
	fontFamilyOptions,
	fontSizeOptions,
	contentWidthArr,
	fontColors,
	backgroundColors,
} from 'src/constants/articleProps';

export const CustomizerShell = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [appliedState, setAppliedState] =
		useState<ArticleStateType>(defaultArticleState);

	const toggle = () => setIsSidebarOpen((v) => !v);
	const close = () => setIsSidebarOpen(false);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, []);

	const toState = (p: ArticleParams): ArticleStateType => ({
		fontFamilyOption:
			fontFamilyOptions.find((o) => o.value === p.fontFamily) ??
			defaultArticleState.fontFamilyOption,
		fontSizeOption:
			fontSizeOptions.find((o) => o.value === p.fontSize) ??
			defaultArticleState.fontSizeOption,
		contentWidth:
			contentWidthArr.find((o) => o.value === p.contentWidth) ??
			defaultArticleState.contentWidth,
		fontColor:
			fontColors.find((o) => o.value === p.fontColor) ??
			defaultArticleState.fontColor,
		backgroundColor:
			backgroundColors.find((o) => o.value === p.bgColor) ??
			defaultArticleState.backgroundColor,
	});

	return (
		<>
			{/* стрелка всегда видима; isOpen используем для поворота иконки */}
			<ArrowButton isOpen={isSidebarOpen} onClick={toggle} />

			<ArticleParamsForm
				isOpen={isSidebarOpen}
				onClose={close}
				initialState={appliedState}
				onApply={(params) => setAppliedState(toState(params))}
				onReset={() => setAppliedState(defaultArticleState)}
			/>

			{children}
		</>
	);
};
