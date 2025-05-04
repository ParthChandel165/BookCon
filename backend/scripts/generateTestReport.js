const fs = require("fs");
const path = require("path");

// Read the JSON test report
const testReport = require("../test-report.json");

// Generate a markdown report
function generateMarkdownReport(report) {
    const { numFailedTests, numPassedTests, numTotalTests, testResults } =
        report;

    let markdown = `# BookCon Test Report\n\n`;
    markdown += `**Date:** ${new Date().toLocaleString()}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- Total Tests: ${numTotalTests}\n`;
    markdown += `- Passed: ${numPassedTests}\n`;
    markdown += `- Failed: ${numFailedTests}\n\n`;

    markdown += `## Test Results\n\n`;

    testResults.forEach((testSuite) => {
        const { name, status, message } = testSuite;
        const relativePath = path.relative(process.cwd(), name);

        markdown += `### ${relativePath}\n\n`;
        markdown += `Status: ${
            status === "passed" ? "✅ Passed" : "❌ Failed"
        }\n\n`;

        if (message) {
            markdown += `Error: ${message}\n\n`;
        }

        markdown += `| Test | Status | Duration (ms) |\n`;
        markdown += `|------|--------|-------------|\n`;

        testSuite.assertionResults.forEach((test) => {
            const status = test.status === "passed" ? "✅ Passed" : "❌ Failed";
            const duration = test.duration ? test.duration.toFixed(2) : "N/A";
            markdown += `| ${test.title} | ${status} | ${duration} |\n`;

            if (test.failureMessages && test.failureMessages.length > 0) {
                markdown += `\n\`\`\`\n${test.failureMessages.join(
                    "\n"
                )}\n\`\`\`\n\n`;
            }
        });

        markdown += `\n`;
    });

    return markdown;
}

// Write the markdown report to file
const markdownReport = generateMarkdownReport(testReport);
fs.writeFileSync(path.join(process.cwd(), "test-report.md"), markdownReport);
console.log("Test report generated: test-report.md");

// Also generate an HTML report for better presentation
function generateHtmlReport(report) {
    // HTML report generation code
    // (Abbreviated for clarity - full code would include HTML template)
    const { numFailedTests, numPassedTests, numTotalTests } = report;

    let html = `<!DOCTYPE html>
<html>
<head>
    <title>BookCon Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
        .passed { color: #4CAF50; }
        .failed { color: #F44336; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>BookCon Test Report</h1>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    
    <div class="summary">
        <h2>Summary</h2>
        <p>Total Tests: ${numTotalTests}</p>
        <p>Passed: <span class="passed">${numPassedTests}</span></p>
        <p>Failed: <span class="failed">${numFailedTests}</span></p>
    </div>
</body>
</html>`;

    return html;
}

const htmlReport = generateHtmlReport(testReport);
fs.writeFileSync(path.join(process.cwd(), "test-report.html"), htmlReport);
console.log("HTML test report generated: test-report.html");
