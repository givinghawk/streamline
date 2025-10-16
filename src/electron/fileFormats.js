const fs = require('fs').promises;
const path = require('path');

/**
 * File format handlers for Streamline custom extensions
 * All formats use JSON under the hood for compatibility
 */

/**
 * Save queue data to .slqueue file
 * @param {string} filePath - Path to save the queue file
 * @param {Object} queueData - Queue data to save
 * @returns {Promise<boolean>}
 */
async function saveQueue(filePath, queueData) {
  try {
    const data = {
      version: '1.0.0',
      type: 'slqueue',
      createdAt: new Date().toISOString(),
      queue: queueData.queue.map(item => ({
        id: item.id,
        fileName: item.file.name,
        filePath: item.file.path,
        fileSize: item.file.size,
        fileType: item.fileType,
        preset: item.preset,
        advancedSettings: item.advancedSettings,
        outputDirectory: item.outputDirectory,
        outputPath: item.outputPath,
        status: item.status,
        progress: item.progress,
        originalSize: item.originalSize,
        compressedSize: item.compressedSize,
        error: item.error,
        qualityMetrics: item.qualityMetrics,
      })),
      settings: {
        overwriteFiles: queueData.overwriteFiles,
        maxConcurrentJobs: queueData.maxConcurrentJobs,
      },
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving queue:', error);
    throw error;
  }
}

/**
 * Load queue data from .slqueue file
 * @param {string} filePath - Path to the queue file
 * @returns {Promise<Object>}
 */
async function loadQueue(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    // Validate format
    if (data.type !== 'slqueue') {
      throw new Error('Invalid queue file format');
    }

    return data;
  } catch (error) {
    console.error('Error loading queue:', error);
    throw error;
  }
}

/**
 * Save preset to .slpreset file
 * @param {string} filePath - Path to save the preset file
 * @param {Object} presetData - Preset data to save
 * @returns {Promise<boolean>}
 */
async function savePreset(filePath, presetData) {
  try {
    const data = {
      version: '1.0.0',
      type: 'slpreset',
      createdAt: new Date().toISOString(),
      preset: {
        id: presetData.id,
        name: presetData.name,
        description: presetData.description,
        category: presetData.category,
        settings: presetData.settings,
      },
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving preset:', error);
    throw error;
  }
}

/**
 * Load preset from .slpreset or .json file
 * @param {string} filePath - Path to the preset file
 * @returns {Promise<Object>}
 */
async function loadPreset(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    // Support both .slpreset and legacy .json formats
    if (data.type === 'slpreset') {
      return data;
    } else if (data.preset || data.id) {
      // Legacy JSON format - wrap it
      return {
        version: '1.0.0',
        type: 'slpreset',
        createdAt: new Date().toISOString(),
        preset: data.preset || data,
      };
    } else {
      throw new Error('Invalid preset file format');
    }
  } catch (error) {
    console.error('Error loading preset:', error);
    throw error;
  }
}

/**
 * Save analysis data to .slanalysis file
 * @param {string} filePath - Path to save the analysis file
 * @param {Object} analysisData - Analysis data to save
 * @returns {Promise<boolean>}
 */
async function saveAnalysis(filePath, analysisData) {
  try {
    const data = {
      version: '1.0.0',
      type: 'slanalysis',
      createdAt: new Date().toISOString(),
      sourceFile: {
        name: analysisData.fileName,
        path: analysisData.filePath,
        size: analysisData.fileSize,
      },
      fileInfo: analysisData.fileInfo,
      bitrateAnalysis: analysisData.bitrateAnalysis,
      sceneDetection: analysisData.sceneDetection,
      contentAnalysis: analysisData.contentAnalysis,
      recommendations: analysisData.recommendations,
      metadata: analysisData.metadata,
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }
}

/**
 * Load analysis data from .slanalysis file
 * @param {string} filePath - Path to the analysis file
 * @returns {Promise<Object>}
 */
async function loadAnalysis(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    // Validate format
    if (data.type !== 'slanalysis') {
      throw new Error('Invalid analysis file format');
    }

    return data;
  } catch (error) {
    console.error('Error loading analysis:', error);
    throw error;
  }
}

/**
 * Save report to .slreport file
 * @param {string} filePath - Path to save the report file
 * @param {Object} reportData - Report data to save
 * @returns {Promise<boolean>}
 */
async function saveReport(filePath, reportData) {
  try {
    const data = {
      version: '1.0.0',
      type: 'slreport',
      createdAt: new Date().toISOString(),
      reportType: reportData.reportType, // 'queue', 'encode', 'fileinfo'
      summary: {
        totalItems: reportData.totalItems,
        completedItems: reportData.completedItems,
        failedItems: reportData.failedItems,
        totalOriginalSize: reportData.totalOriginalSize,
        totalCompressedSize: reportData.totalCompressedSize,
        spaceSaved: reportData.spaceSaved,
        compressionRatio: reportData.compressionRatio,
      },
      items: reportData.items,
      settings: reportData.settings,
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving report:', error);
    throw error;
  }
}

/**
 * Load report from .slreport file
 * @param {string} filePath - Path to the report file
 * @returns {Promise<Object>}
 */
async function loadReport(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    // Validate format
    if (data.type !== 'slreport') {
      throw new Error('Invalid report file format');
    }

    return data;
  } catch (error) {
    console.error('Error loading report:', error);
    throw error;
  }
}

module.exports = {
  saveQueue,
  loadQueue,
  savePreset,
  loadPreset,
  saveAnalysis,
  loadAnalysis,
  saveReport,
  loadReport,
};
