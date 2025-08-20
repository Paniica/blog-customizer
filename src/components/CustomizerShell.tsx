import { PropsWithChildren, useMemo, useState } from 'react';
import { ArticleParamsForm } from './article-params-form/ArticleParamsForm';
import {
	type ArticleParams,
	defaultArticleParams,
} from 'src/constants/articleProps';
import styles from 'src/App.module.scss';

export const CustomizerShell = ({ children }: PropsWithChildren) => {
	// ✅ храним ПЛОСКИЕ строки (ArticleParams), а не объекты-опции
	const [params, setParams] = useState<ArticleParams>(defaultArticleParams);

	// Выставляем CSS-переменные на корневом контейнере
	const cssVars = useMemo(
		() =>
			({
				['--font-family' as any]: params.fontFamily,
				['--font-size' as any]: params.fontSize,
				['--font-color' as any]: params.fontColor,
				['--bg-color' as any]: params.bgColor,
				['--container-width' as any]: params.contentWidth,
				background: params.bgColor,
			} as React.CSSProperties),
		[params]
	);

	return (
		<main className={styles.main} style={cssVars}>
			<ArticleParamsForm
				appliedParams={params} // ✅ НОВОЕ имя пропса
				onApply={setParams} // ✅ принимает ArticleParams
				onReset={() => setParams(defaultArticleParams)}
			/>
			{children}
		</main>
	);
};
