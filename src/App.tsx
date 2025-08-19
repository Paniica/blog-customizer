import { useState } from 'react';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { Article } from './components/article/Article';
import styles from './App.module.scss';

import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	type ArticleStateType,
} from './constants/articleProps';

// Дефолтные настройки статьи
const defaultArticleState: ArticleStateType = {
	fontFamilyOption: fontFamilyOptions[0],
	fontSizeOption: fontSizeOptions[0],
	fontColor: fontColors[0],
	backgroundColor: backgroundColors[0],
	contentWidth: contentWidthArr[0],
};

export default function App() {
	const [appliedSettings, setAppliedSettings] =
		useState<ArticleStateType>(defaultArticleState);

	return (
		<main
			className={styles.main}
			style={
				{
					'--font-family': appliedSettings.fontFamilyOption.value,
					'--font-size': appliedSettings.fontSizeOption.value,
					'--font-color': appliedSettings.fontColor.value,
					'--container-width': appliedSettings.contentWidth.value,
					'--bg-color': appliedSettings.backgroundColor.value,
				} as React.CSSProperties
			}>
			<ArticleParamsForm
				appliedSettings={appliedSettings}
				onApply={setAppliedSettings}
				onReset={() => setAppliedSettings(defaultArticleState)}
			/>
			<Article />
		</main>
	);
}
