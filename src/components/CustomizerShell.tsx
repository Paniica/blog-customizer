import { useState } from 'react';
import { ArticleParamsForm } from 'src/components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	type ArticleStateType,
} from 'src/constants/articleProps';

export const CustomizerShell = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [appliedState, setAppliedState] =
		useState<ArticleStateType>(defaultArticleState);

	return (
		<>
			<ArticleParamsForm
				appliedSettings={appliedState}
				onApply={setAppliedState}
				onReset={() => setAppliedState(defaultArticleState)}
			/>
			{children}
		</>
	);
};
