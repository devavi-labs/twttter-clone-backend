export const containsSpecialCharacters: RegExp = /[-/:-@[-`{-~]/;
export const validEmail: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const validUrl: RegExp = /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/gi;
export const notTheseWords = /(|\()-\w+[a-zA-Z](\)|)/gi;
export const hashtags = /(|\()#\w+(\)|)/gi;
export const mentions = /(|\()@\w+(\)|)/gi;
export const fromTheseUsernames = /(|\()from:\s*\w+(\)|)/gi;
export const toTheseUsernames = /(|\()to:\s*\w+(\)|)/gi;
export const filterOut = /(|\()-filter:\s*\w+(\)|)/gi;
export const filterIn = /(|\()filter:\s*\w+(\)|)/gi;
export const minReplies = /(|\()min_replies:\s*\w+(\)|)/gi;
export const minLikes = /(|\()min_likes:\s*\w+(\)|)/gi;
export const minRequacks = /(|\()min_requacks:\s*\w+(\)|)/gi;
export const untilDate = /(|\()until:\s*\w+-\w+-\w+(\)|)/gi;
export const sinceDate = /(|\()since:\s*\w+-\w+-\w+(\)|)/gi;
export const exactPhrase = /(|\()".*"(\)|)/gi;
export const or = /(|\()(\w+\s{1,}OR\s{1,}\w+|\s{1,}OR\s{1,}\w+)(\)|)/gi;
