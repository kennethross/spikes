const GitHub = require('github-api');
const Slack = require('@slack/client').WebClient;
const secrets = require('./secrets');

const OPEN_PRS = { state: 'open' }

const api = new GitHub(secrets.gitHub.credentials);
const slack = new Slack(secrets.slack.token);

let repo = api.getRepo(
  secrets.gitHub.repoOwner,
  secrets.gitHub.repoName
);

repo.listPullRequests(OPEN_PRS)
  .then(getIndividualPullRequests)
  .then(findUnmergeablePrs)
  .then(notifySlack)
  .catch(console.log);

function getIndividualPullRequests(listOfPrs) {
  let allPrs = listOfPrs.data.map(each => {
    return repo.getPullRequest(each.number)
      .then(toData);
  });
  return Promise.all(allPrs);
}

function toData(pullRequest) {
  return Promise.resolve(pullRequest.data);
}

function findUnmergeablePrs(pullRequests) {
  let unmergablePrs = pullRequests.filter(pullRequest => {
    return !pullRequest.mergeable;
  });
  return Promise.resolve(unmergablePrs);
}

function notifySlack(unmergeablePrs) {
  return Promise.all(unmergeablePrs.map(each => {
    return slack.chat.postMessage(secrets.slack.recipient, createSlackMessage(each))
      .then(Promise.resolve(unmergeablePrs));
  }));
}

function createSlackMessage(pr) {
  return `<${pr.html_url}|${pr.title}> has conflicts with master!`;
}
