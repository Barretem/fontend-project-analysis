/*
 * @Author: Barret
 * @Date:   2024-12-29 17:03:44
 * @Description 分析文件类型
 * @FilePath: /src/features/analysisFileType.ts
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import { getRootPath } from '../../utils';
import FileAnalysis, { IFileInfo } from '../../utils/fileAnalysis';

interface IFileTypeItem {
  /** 文件类型 */
  type: string;
  /** 文件数量 */
  count: number;
  /** 文件占比 */
  percent: string;
}

export interface IAnalysisResult {
  /** 文件数量 */
  fileCount: number;
  /** 项目的总大小 */
  projectSize: number;
  /** 文件信息列表 */
  fileInfoList: IFileInfo[];
  /** 分析的目录路径 */
  analysisDirectory: string;
  /** 项目的总代码行数 */
  projectLines: number;
  /** 项目的总代码字符数 */
  projectChars: number;
  /** 项目的总代码注释数 */
  projectComments: number;
  /** 项目的总代码空白行数 */
  projectBlanks: number;
  /** 项目的总代码复杂度 */
  projectComplexity: number;
  /** 文件类型列表 */
  fileTypeList: IFileTypeItem[];
}

// 递归获取文件夹中的文件列表
const getFileList = (dirPath: string) => {
  const fileList: string[] = [];
  const files = fs.readdirSync(dirPath);
  files.forEach((item) => {
    const filePath = path.join(dirPath, item);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fileList.push(...getFileList(filePath));
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
};

export default class AnalysisFileType {
  /** 要分析的文件夹 */
  private dirPath: string;
  public constructor(dirPath: string) {
    this.dirPath = dirPath;
  }
  public analysis(): IAnalysisResult {
    // 文件列表
    const filePaths = getFileList(path.resolve(getRootPath(), this.dirPath));
    // 统计文件数量
    const fileCount = filePaths.length
    // 分析文件内容
    const fileInfoList = filePaths.map((item) => {
      return new FileAnalysis(item).analysis();
    });
    // 文件总大小
    const projectSize = fileInfoList.reduce((pre, cur) => {
      return pre + cur.size;
    }, 0);
    // 文件总代码行数
    const projectLines = fileInfoList.reduce((pre, cur) => {
      return pre + (cur.lines || 0);
    }, 0);
    // 文件总代码字符数
    const projectChars = fileInfoList.reduce((pre, cur) => {
      return pre + (cur.chars || 0);
    }, 0);
    // 文件总代码注释数
    const projectComments = fileInfoList.reduce((pre, cur) => {
      return pre + (cur.comments || 0);
    }, 0);

    // 文件总代码空白行数
    const projectBlanks = fileInfoList.reduce((pre, cur) => {
      return pre + (cur.blankLines || 0);
    }, 0);

    // 文件总代码复杂度
    const projectComplexity = fileInfoList.reduce((pre, cur) => {
      return pre + (cur.complexity || 0);
    }, 0);

    // 文件类型列表
    const fileTypeList = fileInfoList.reduce<IFileTypeItem[]>((pre, cur) => {
      const fileType = cur.type;
      const fileTypeIndex = pre.findIndex((item) => item.type === fileType);
      if (fileTypeIndex === -1) {
        pre.push({
          type: fileType,
          count: 1,
          percent: ((1 / fileInfoList.length) * 100).toFixed(2) + '%',
        });
      } else {
        pre[fileTypeIndex].count++;
        pre[fileTypeIndex].percent =
          ((pre[fileTypeIndex].count / fileInfoList.length) * 100).toFixed(2) +
          '%';
      }
      return pre;
    }, []);

    return {
      fileCount,
      fileInfoList,
      projectSize,
      analysisDirectory: this.dirPath,
      projectLines,
      projectChars,
      projectComments,
      projectBlanks,
      projectComplexity,
      fileTypeList,
    };
  }
}
