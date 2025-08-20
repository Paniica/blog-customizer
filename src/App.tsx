import { useMemo, useState } from 'react';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { Article } from './components/article/Article';
import styles from './App.module.scss';

import {
	type ArticleParams,
	defaultArticleParams,
} from './constants/articleProps';

export default function App() {
	// Храним плоские параметры (строки) — без объектов опций
	const [params, setParams] = useState<ArticleParams>(defaultArticleParams);

	// Выставляем CSS-переменные на контейнере приложения
	const cssVars = useMemo(
		() =>
			({
				['--font-family' as any]: params.fontFamily,
				['--font-size' as any]: params.fontSize,
				['--font-color' as any]: params.fontColor,
				['--bg-color' as any]: params.bgColor,
				['--container-width' as any]: params.contentWidth,
				// на всякий случай — прямой фон контейнера
				background: params.bgColor,
			} as React.CSSProperties),
		[params]
	);

	return (
		<main className={styles.main} style={cssVars}>
			<ArticleParamsForm
				appliedParams={params}
				onApply={setParams}
				onReset={() => setParams(defaultArticleParams)}
			/>
			<Article />
		</main>
	);
}
