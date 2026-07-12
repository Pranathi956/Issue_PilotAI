const axios = require('axios');

const suggestPriority = async (title, description) => {
  const prompt = `Suggest a priority for this issue. Reply with only one word: Low, Medium, or High.\nTitle: ${title}\nDescription: ${description}`;

  if (!process.env.GROQ_API_KEY) {
    const lowerTitle = `${title} ${description}`.toLowerCase();
    if (lowerTitle.includes('urgent') || lowerTitle.includes('critical') || lowerTitle.includes('down') || lowerTitle.includes('blocker')) {
      return 'High';
    }
    if (lowerTitle.includes('minor') || lowerTitle.includes('cosmetic') || lowerTitle.includes('typo')) {
      return 'Low';
    }
    return 'Medium';
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data.choices?.[0]?.message?.content?.trim();
    const valid = ['Low', 'Medium', 'High'];
    const normalized = result === 'Critical' ? 'High' : result;
    return valid.includes(normalized) ? normalized : 'Medium';
  } catch (error) {
    return 'Medium';
  }
};

const generateDailySummary = async (project, issues) => {
  const openCount = issues.filter((issue) => issue.status === 'Open').length;
  const closedCount = issues.filter((issue) => issue.status === 'Closed').length;
  return `Project ${project.name} has ${openCount} open issues and ${closedCount} closed issues today. Keep focus on the highest priority items.`;
};

const generateProjectSummary = async (project, issues) => {
  const totalIssues = issues.length;
  const completedIssues = issues.filter((issue) => issue.status === 'Closed').length;
  const openIssues = issues.filter((issue) => issue.status === 'Open').length;
  const inProgressIssues = issues.filter((issue) => issue.status === 'In Progress').length;
  const highPriorityPending = issues.filter((issue) => issue.priority === 'High' || issue.priority === 'Critical').filter((issue) => issue.status !== 'Closed').length;
  const overallProgress = totalIssues === 0 ? 0 : Math.round((completedIssues / totalIssues) * 100);
  const insight = overallProgress >= 80
    ? 'Momentum is strong and the team is close to finishing the project scope.'
    : overallProgress >= 50
      ? 'The project is progressing steadily; focus on clearing pending high-priority work.'
      : 'The project is still in early progress; prioritize the next set of issues to build momentum.';

  return `Project ${project.name}\nTotal Issues: ${totalIssues}\nCompleted Issues: ${completedIssues}\nOpen Issues: ${openIssues}\nIn Progress Issues: ${inProgressIssues}\nHigh Priority Pending Issues: ${highPriorityPending}\nOverall Progress: ${overallProgress}%\nShort Developer Insight: ${insight}`;
};

module.exports = { suggestPriority, generateDailySummary, generateProjectSummary };
