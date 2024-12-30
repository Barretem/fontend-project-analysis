/*
 * @Author: Barret
 * @Date:   2024-12-29 17:10:23
 * @Description 分析文件的内容, 其中代码行数, 代码字符数, 代码注释数, 代码空白行数, 代码复杂度仅支持分析.ts,.js,.tsx,.jsx,.less,.css类型的文件.
 */
import fs from 'fs-extra';
import path from 'path';

interface FileInfo {
  /** 文件名称 */
  name: string;
  /** 文件路径 */
  path: string;
  /** 文件大小 */
  size: number;
  /** 文件类型 */
  type: string;
  /** 文件代码行数 */
  lines?: number;
  /** 文件代码字符数 */
  chars?: number;
  /** 文件代码注释数 */
  comments?: number;
  /** 文件代码空白行数 */
  blankLines?: number;
  /** 文件代码复杂度 */
  complexity?: number;
  /** TODO 文件代码错误数(接入eslint) */
  // errors: number;
}

export default class FileAnalysis {
  private filePath: string;
  private constructor(filePath: string) {
    this.filePath = filePath;
  }
  private analysisCode(): Required<Pick<FileInfo, 'lines' | 'chars' | 'comments' | 'blankLines' | 'complexity'>> {
    const fileDetail = fs.readFileSync(this.filePath, 'utf-8')
    const lines = fileDetail.split('\n');
    let linesCount = 0;
    let charsCount = 0;
    let commentsCount = 0;
    let blankLinesCount = 0;
    let complexityCount = 0;
    // let errorsCount = 0;
    for (const line of lines) {
      linesCount++;
      charsCount += line.length;
      if (line.trim() === '') {
        blankLinesCount++;
      }
      if (line.trim().startsWith('//')) {
        commentsCount++;
      }
      if (line.trim().startsWith('/*') && line.trim().endsWith('*/')) {
        commentsCount++;
      }
      if (line.trim().startsWith('if') || line.trim().startsWith('for') || line.trim().startsWith('while')) {
        complexityCount++;
      }
      // if (line.trim().startsWith('console.log')) {
      //   errorsCount++;
      // }
    }
    return {
      lines: linesCount,
      chars: charsCount,
      comments: commentsCount,
      blankLines: blankLinesCount,
      complexity: complexityCount,
    };
  }

  public analysis(): FileInfo {
    // 检查文件是否存在
    if (!fs.existsSync(this.filePath)) {
      throw new Error('文件不存在');
    }
    // 读取文件名称
    const name = path.basename(this.filePath);
    // 读取文件大小
    const size = fs.statSync(this.filePath).size;
    // 读取文件类型
    const type = path.extname(this.filePath);
    const baseInfo = {
      name,
      path: this.filePath,
      size,
      type,
    };
    // 判断文件类型
    // 如果文件类型为 .ts,.js,.tsx,.jsx,.less,.css,则分析文件内容
    if (['.ts', '.js', '.tsx', '.jsx', '.less', '.css'].includes(type)) {
      const codeInfo = this.analysisCode();
      return {
        ...baseInfo,
        ...codeInfo,
      };
    }
    // 分析文件内容
    return baseInfo;
  }
}