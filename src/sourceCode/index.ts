/**
 * 分析项目内容，并且输出 markdown 报告
 * @Author: Barret
 * @Date:   2024-12-29 17:10:23
 * @Description 分析文件的内容, 其中代码行数, 代码字符数, 代码注释数, 代码空白行数, 代码复杂度仅支持分析.ts,.js,.tsx,.jsx,.less,.css类型的文件.
 */
import AnalysisFileType from "./features/analysisFileType";
import OutputAnalysisReport from "./features/outputAnalysisReport";

export default class SourceCode {
  /** 要分析的文件夹 */
  private analysisDirectoryPath: string;
  /** 输出的文件 */
  private outputFile: string;
  public constructor({
    analysisDirectoryPath,
    outputFile,
  }: {
    analysisDirectoryPath: string;
    outputFile: string;
  }) {
    this.analysisDirectoryPath = analysisDirectoryPath;
    this.outputFile = outputFile;
    //
  }
  public async analysis() {
    // 分析文件内容
    const analysisFileType = new AnalysisFileType(this.analysisDirectoryPath);
    const analysisResult = await analysisFileType.analysis();
    // 输出分析报告
    const outputAnalysisReport = new OutputAnalysisReport({analysisResult, outputFile: this.outputFile });
    await outputAnalysisReport.output();
  }
}
