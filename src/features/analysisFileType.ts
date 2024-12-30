/*
 * @Author: Barret
 * @Date:   2024-12-29 17:03:44
 * @Description 分析文件类型
 * @FilePath: /src/features/analysisFileType.ts
 */
import fs from 'fs-extra';
import path from 'path';
import { AnalysisFileType } from '../analysisFileType';

export class AnalysisFileType {
  /** 要分析的文件夹 */
  private dirPath: string;
  private constructor(dirPath: string) {
    this.dirPath = dirPath;
  }
  public analysis(): string {
    // 遍历文件夹
    const filePaths = fs.readdirSync(this.dirPath);
    // 统计空文件夹数量
    const emptyDirCount = filePaths.filter((item) => {
      const filePath = path.join(this.dirPath, item);
      return fs.statSync(filePath).isDirectory() && fs.readdirSync(filePath).length === 0;
    }).length;
    // 统计文件数量
    const fileCount = filePaths.filter((item) => {
      const filePath = path.join(this.dirPath, item);
      return fs.statSync(filePath).isFile();
    }).length;
    // 获取文件路径列表
    const fileList = filePaths.filter((item) => {
      const filePath = path.join(this.dirPath, item);
      return fs.statSync(filePath).isFile();
    }).map((item) => {
      const filePath = path.join(this.dirPath, item);
      return filePath;
    });
    // 分析文件内容
  }
}
