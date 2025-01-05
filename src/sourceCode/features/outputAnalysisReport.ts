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
    const { analysisDirectory, projectSize, projectLines, projectChars, projectComments, projectBlanks, projectComplexity, fileInfoList} = this.analysisResult;
    const projectSizeStr = (projectSize / 1024).toFixed(2) + 'KB';
    const fileTypeInfo = fileInfoList.reduce((pre, cur) => {
      const { type } = cur;
      if (pre[type]) {
        pre[type].count++;
        pre[type].size += cur.size;
        pre[type].lines += cur.lines || 0;
        pre[type].chars += cur.chars || 0;
        pre[type].comments += cur.comments || 0;
        pre[type].blankLines += cur.blankLines || 0;
        pre[type].complexity += cur.complexity || 0;
      } else {
        pre[type] = {
          count: 1,
          size: cur.size,
          lines: cur.lines || 0,
          chars: cur.chars || 0,
          comments: cur.comments || 0,
          blankLines: cur.blankLines || 0,
          complexity: cur.complexity || 0,
        }
      }
      return pre;
    }, {} as Record<string, { count: number, size: number, lines: number, chars: number, comments: number, blankLines: number, complexity: number }>)

    const fileType = Object.keys(fileTypeInfo).map((type) => {
      const { count, size, lines, chars, comments, blankLines, complexity } = fileTypeInfo[type];
      const sizeStr = (size / 1024).toFixed(2) + 'KB';
      const countStr = count ? `${count}个` : '-';
      const linesStr = lines ? `${lines}行` : '-';
      const charsStr = chars ? `${chars}个字符` : '-';
      const commentsStr = comments ? `${comments}个注释` : '-';
      const blankLinesStr = blankLines ? `${blankLines}行空白行` : '-';
      const complexityStr = complexity ? `${complexity}个if&while` : '-';
      // 文件占比
      const sizePercent = (size / projectSize * 100).toFixed(2) + '%';
      return `| ${type} | ${countStr} | ${sizePercent} | ${sizeStr} | ${linesStr} | ${charsStr} | ${commentsStr} | ${blankLinesStr} | ${complexityStr} |`
    }).join('\n');

    return `
# 项目分析报告

## 项目概览

| 分析路径 | 项目大小 | 项目代码行数 | 项目代码字符数 | 项目代码注释数 | 项目代码空白行数 | 项目代码复杂度 |
| --------- | -------- | ------------ | -------------- | -------------- | ---------------- | -------------- |
| ${analysisDirectory} | ${projectSizeStr} | ${projectLines}行 | ${projectChars}个字符 | ${projectComments}个注释 | ${projectBlanks}行空白行 | ${projectComplexity}个if&while |

## 文件类型分析

| 文件类型 | 文件数量 | 文件占比 | 该类型下的文件总大小 | 该类型下的文件总代码行数 | 该类型下的文件总代码字符数 | 该类型下的文件总代码注释数 | 该类型下的文件总代码空白行数 | 该类型下的文件总代码复杂度 |
| --------- | -------- | -------- | --------------------- | ------------------------ | -------------------------- | -------------------------- | ----------------------------- | -------------------------- |
${fileType}

    `
  }
}