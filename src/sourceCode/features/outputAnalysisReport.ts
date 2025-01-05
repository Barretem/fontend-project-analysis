/**
 * 输出分析报告
 * @Description 分析文件的内容, 其中代码行数, 代码字符数, 代码注释数, 代码空白行数, 代码复杂度仅支持分析.ts,.js,.tsx,.jsx,.less,.css类型的文件.
 * @Author: Barret
 * @Date:   2024-12-29 17:10:23
 */
import { IAnalysisResult } from "./analysisFileType";
import * as fs from 'fs-extra';

export default class OutputAnalysisReport {
  /** 项目分析内容 */
  private analysisResult: IAnalysisResult;
  /** 输出的文件路径 */
  private outputFile: string;
  public constructor({ analysisResult, outputFile }: { analysisResult: IAnalysisResult, outputFile: string }) {
    this.analysisResult = analysisResult;
    this.outputFile = outputFile;
  }
  public output() {
    const fileStr = this.reportTemplate()
    fs.writeFileSync(this.outputFile, fileStr, 'utf-8');
  }

  reportTemplate() {
    const { analysisDirectory, projectSize, projectLines, projectChars, projectComments, projectBlanks, projectComplexity, fileTypeList} = this.analysisResult;
    const projectSizeStr = (projectSize / 1024).toFixed(2) + 'KB';
    const fileType = fileTypeList.map((item) => {
      return `| ${item.type} | ${item.count} | ${item.percent} |`
    }).join('\n');
    return `
# 项目分析报告

## 项目概览

| 分析路径 | 项目大小 | 项目代码行数 | 项目代码字符数 | 项目代码注释数 | 项目代码空白行数 | 项目代码复杂度 |
| --------- | -------- | ------------ | -------------- | -------------- | ---------------- | -------------- |
| ${analysisDirectory} | ${projectSizeStr} | ${projectLines} | ${projectChars} | ${projectComments} | ${projectBlanks} | ${projectComplexity} |

## 文件类型分析

| 文件类型 | 文件数量 | 文件占比 |
| --------- | -------- | -------- |
${fileType}
    `
  }
}