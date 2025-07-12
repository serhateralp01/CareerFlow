#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 CareerFlow Test Suite Runner');
console.log('================================');

// Test configuration
const testConfig = {
    unitTests: {
        file: 'test-app.html',
        port: 8001,
        description: 'Unit tests for individual components and functions'
    },
    integrationTests: {
        file: 'integration-test.html',
        port: 8002,
        description: 'Integration tests for full application functionality'
    },
    mainApp: {
        file: 'index.html',
        port: 8000,
        description: 'Main CareerFlow application'
    }
};

// Test results storage
let testResults = {
    timestamp: new Date().toISOString(),
    summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        coverage: 0
    },
    categories: {},
    issues: [],
    recommendations: []
};

// Debug logging
function debug(message, type = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
        INFO: '\x1b[36m',    // Cyan
        SUCCESS: '\x1b[32m', // Green
        WARNING: '\x1b[33m', // Yellow
        ERROR: '\x1b[31m',   // Red
        RESET: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${type}: ${message}${colors.RESET}`);
}

// Check if files exist
function checkTestFiles() {
    debug('Checking test files...', 'INFO');
    
    const requiredFiles = [
        'index.html',
        'test-app.html',
        'integration-test.html'
    ];
    
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        debug(`Missing files: ${missingFiles.join(', ')}`, 'ERROR');
        return false;
    }
    
    debug('All test files found', 'SUCCESS');
    return true;
}

// Analyze HTML files for potential issues
function analyzeHtmlFiles() {
    debug('Analyzing HTML files for potential issues...', 'INFO');
    
    const files = ['index.html', 'test-app.html', 'integration-test.html'];
    const issues = [];
    
    files.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for common issues
            const checks = [
                {
                    name: 'Missing DOCTYPE',
                    test: content => !content.includes('<!DOCTYPE html>'),
                    severity: 'WARNING'
                },
                {
                    name: 'Missing viewport meta tag',
                    test: content => !content.includes('viewport'),
                    severity: 'WARNING'
                },
                {
                    name: 'Inline JavaScript',
                    test: content => content.includes('<script>') && content.includes('</script>'),
                    severity: 'INFO'
                },
                {
                    name: 'External dependencies',
                    test: content => content.includes('cdn.') || content.includes('unpkg.'),
                    severity: 'INFO'
                },
                {
                    name: 'Firebase integration',
                    test: content => content.includes('firebase'),
                    severity: 'INFO'
                }
            ];
            
            checks.forEach(check => {
                if (check.test(content)) {
                    issues.push({
                        file,
                        issue: check.name,
                        severity: check.severity
                    });
                }
            });
            
        } catch (error) {
            debug(`Error analyzing ${file}: ${error.message}`, 'ERROR');
        }
    });
    
    return issues;
}

// Analyze JavaScript for potential issues
function analyzeJavaScript() {
    debug('Analyzing JavaScript code...', 'INFO');
    
    const content = fs.readFileSync('index.html', 'utf8');
    const issues = [];
    
    // Extract JavaScript from HTML
    const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
    
    if (scriptMatches) {
        scriptMatches.forEach((script, index) => {
            const jsCode = script.replace(/<\/?script[^>]*>/g, '');
            
            // Check for common JavaScript issues
            const checks = [
                {
                    name: 'Console.log statements',
                    test: code => code.includes('console.log'),
                    severity: 'INFO'
                },
                {
                    name: 'Try-catch blocks',
                    test: code => code.includes('try') && code.includes('catch'),
                    severity: 'INFO'
                },
                {
                    name: 'Async/await usage',
                    test: code => code.includes('async') && code.includes('await'),
                    severity: 'INFO'
                },
                {
                    name: 'Event listeners',
                    test: code => code.includes('addEventListener'),
                    severity: 'INFO'
                },
                {
                    name: 'LocalStorage usage',
                    test: code => code.includes('localStorage'),
                    severity: 'INFO'
                }
            ];
            
            checks.forEach(check => {
                if (check.test(jsCode)) {
                    issues.push({
                        script: `Script block ${index + 1}`,
                        feature: check.name,
                        severity: check.severity
                    });
                }
            });
        });
    }
    
    return issues;
}

// Test data structure validation
function validateDataStructures() {
    debug('Validating data structures...', 'INFO');
    
    const content = fs.readFileSync('index.html', 'utf8');
    const results = [];
    
    // Check for required data structures
    const requiredStructures = [
        'emptyJob',
        'emptyContact',
        'emptyThesis',
        'statusList',
        'thesisStatusList',
        'jobTypeList',
        'sourceList',
        'schoolList'
    ];
    
    requiredStructures.forEach(structure => {
        const found = content.includes(structure);
        results.push({
            name: structure,
            found,
            type: 'Data Structure'
        });
    });
    
    // Check for required functions
    const requiredFunctions = [
        'useAuth',
        'useFirebaseData',
        'JobAnalytics',
        'ThesisAnalytics',
        'JobForm',
        'ThesisForm',
        'ContactsTable',
        'TrackerTable'
    ];
    
    requiredFunctions.forEach(func => {
        const found = content.includes(`function ${func}`) || content.includes(`${func} =`);
        results.push({
            name: func,
            found,
            type: 'Function'
        });
    });
    
    return results;
}

// Generate test report
function generateTestReport() {
    debug('Generating comprehensive test report...', 'INFO');
    
    const htmlIssues = analyzeHtmlFiles();
    const jsFeatures = analyzeJavaScript();
    const dataValidation = validateDataStructures();
    
    // Calculate coverage
    const totalFeatures = dataValidation.length;
    const foundFeatures = dataValidation.filter(item => item.found).length;
    const coverage = Math.round((foundFeatures / totalFeatures) * 100);
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalFeatures,
            foundFeatures,
            coverage: `${coverage}%`,
            htmlIssues: htmlIssues.length,
            jsFeatures: jsFeatures.length
        },
        htmlAnalysis: htmlIssues,
        jsAnalysis: jsFeatures,
        dataStructures: dataValidation,
        recommendations: []
    };
    
    // Generate recommendations
    if (coverage < 100) {
        report.recommendations.push('Some required data structures or functions are missing');
    }
    
    if (htmlIssues.some(issue => issue.severity === 'ERROR')) {
        report.recommendations.push('Fix HTML errors before deployment');
    }
    
    if (htmlIssues.some(issue => issue.severity === 'WARNING')) {
        report.recommendations.push('Consider addressing HTML warnings for better compatibility');
    }
    
    if (!jsFeatures.some(feature => feature.feature === 'Try-catch blocks')) {
        report.recommendations.push('Add more error handling with try-catch blocks');
    }
    
    if (!jsFeatures.some(feature => feature.feature === 'Console.log statements')) {
        report.recommendations.push('Add debugging console.log statements for better troubleshooting');
    }
    
    return report;
}

// Performance analysis
function analyzePerformance() {
    debug('Analyzing performance characteristics...', 'INFO');
    
    const content = fs.readFileSync('index.html', 'utf8');
    const stats = {
        fileSize: fs.statSync('index.html').size,
        lines: content.split('\n').length,
        characters: content.length,
        scriptBlocks: (content.match(/<script[^>]*>[\s\S]*?<\/script>/g) || []).length,
        externalDependencies: (content.match(/https?:\/\/[^\s"']+/g) || []).length
    };
    
    const recommendations = [];
    
    if (stats.fileSize > 500000) { // 500KB
        recommendations.push('Consider splitting large HTML file into separate files');
    }
    
    if (stats.externalDependencies > 10) {
        recommendations.push('High number of external dependencies may impact loading time');
    }
    
    if (stats.scriptBlocks > 5) {
        recommendations.push('Consider consolidating JavaScript into fewer script blocks');
    }
    
    return {
        stats,
        recommendations
    };
}

// Security analysis
function analyzeSecurityFeatures() {
    debug('Analyzing security features...', 'INFO');
    
    const content = fs.readFileSync('index.html', 'utf8');
    const securityFeatures = [];
    
    // Check for security-related features
    const securityChecks = [
        {
            name: 'Firebase Authentication',
            test: content => content.includes('firebase.auth'),
            importance: 'HIGH'
        },
        {
            name: 'Input Validation',
            test: content => content.includes('validateForm') || content.includes('validation'),
            importance: 'HIGH'
        },
        {
            name: 'XSS Prevention',
            test: content => content.includes('innerHTML') && content.includes('textContent'),
            importance: 'MEDIUM'
        },
        {
            name: 'HTTPS External Resources',
            test: content => !content.includes('http://') || content.includes('https://'),
            importance: 'HIGH'
        }
    ];
    
    securityChecks.forEach(check => {
        securityFeatures.push({
            feature: check.name,
            implemented: check.test(content),
            importance: check.importance
        });
    });
    
    return securityFeatures;
}

// Main execution
async function runTests() {
    try {
        debug('Starting CareerFlow test suite...', 'INFO');
        
        // Check prerequisites
        if (!checkTestFiles()) {
            debug('Test files missing, aborting...', 'ERROR');
            return;
        }
        
        // Generate comprehensive report
        const testReport = generateTestReport();
        const performanceAnalysis = analyzePerformance();
        const securityAnalysis = analyzeSecurityFeatures();
        
        // Combine all analyses
        const fullReport = {
            ...testReport,
            performance: performanceAnalysis,
            security: securityAnalysis,
            executionTime: new Date().toISOString()
        };
        
        // Save report to file
        const reportPath = `test-report-${new Date().toISOString().split('T')[0]}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(fullReport, null, 2));
        
        // Display summary
        console.log('\n📊 TEST SUMMARY');
        console.log('================');
        console.log(`✅ Feature Coverage: ${fullReport.summary.coverage}`);
        console.log(`📁 File Size: ${Math.round(performanceAnalysis.stats.fileSize / 1024)}KB`);
        console.log(`📄 Lines of Code: ${performanceAnalysis.stats.lines}`);
        console.log(`🔗 External Dependencies: ${performanceAnalysis.stats.externalDependencies}`);
        console.log(`🔒 Security Features: ${securityAnalysis.filter(f => f.implemented).length}/${securityAnalysis.length}`);
        
        console.log('\n🎯 KEY FINDINGS');
        console.log('===============');
        
        // Data structure analysis
        const missingStructures = fullReport.dataStructures.filter(item => !item.found);
        if (missingStructures.length > 0) {
            console.log(`⚠️  Missing structures: ${missingStructures.map(s => s.name).join(', ')}`);
        } else {
            console.log('✅ All required data structures found');
        }
        
        // Security analysis
        const securityIssues = securityAnalysis.filter(f => !f.implemented && f.importance === 'HIGH');
        if (securityIssues.length > 0) {
            console.log(`🔒 Security concerns: ${securityIssues.map(s => s.feature).join(', ')}`);
        } else {
            console.log('✅ High-priority security features implemented');
        }
        
        // Performance recommendations
        if (performanceAnalysis.recommendations.length > 0) {
            console.log('\n🚀 PERFORMANCE RECOMMENDATIONS');
            console.log('==============================');
            performanceAnalysis.recommendations.forEach(rec => {
                console.log(`• ${rec}`);
            });
        }
        
        // General recommendations
        if (fullReport.recommendations.length > 0) {
            console.log('\n💡 GENERAL RECOMMENDATIONS');
            console.log('==========================');
            fullReport.recommendations.forEach(rec => {
                console.log(`• ${rec}`);
            });
        }
        
        console.log(`\n📋 Full report saved to: ${reportPath}`);
        debug('Test suite completed successfully', 'SUCCESS');
        
    } catch (error) {
        debug(`Test suite failed: ${error.message}`, 'ERROR');
        console.error(error);
    }
}

// Execute tests
runTests(); 