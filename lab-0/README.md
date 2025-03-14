# Marking up a letter activity

Activity attribution made to MDN Docs on: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Marking_up_a_letter

## Your task

1. Fork the repo: https://github.com/jaceroldan/web-engineering-starter-pack/fork
2. Construct the appropriate HTML for this letter. Use the contents in `raw-letter.txt`.
3. Find a way to connect the `style.css` file using this resource: https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Styling_the_content#what_is_css. 

The end goal for your letter web page will look like this:
![](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Marking_up_a_letter/letter-update.png)


### Project brief
For this project, your task is to mark up a letter that needs to be hosted on a university intranet. The letter is a response from a research fellow to a prospective PhD student concerning their application to the university.

### Block/structural semantics
1. Use appropriate document structure including doctype, and <html>, <head> and <body> elements.
2. In general, the letter should be marked up as an organization of headings and paragraphs, with the following exception. There is one top level heading (the "Re:" line) and three second level headings.
Use an appropriate list type to mark up the semester start dates, study subjects, and exotic dances.
3. Put the two addresses inside <address> elements. Each line of the address should sit on a new line, but not be in a new paragraph.

### Inline semantics
1. The names of the sender and receiver (and Tel and Email) should be marked up with strong importance.
2. The four dates in the document should have appropriate elements containing machine-readable dates.
3. The first address and first date in the letter should have a class attribute value of sender-column. The CSS you'll add later will cause these to be right aligned, as it should be in the case in a classic letter layout.
4. Mark up the following five acronyms/abbreviations in the main text of the letter — "PhD," "HTML," "CSS," "BC," and "Esq." — to provide expansions of each one.

5. The six sub/superscripts should be marked up appropriately — in the chemical formulae, and the numbers 103 and 104 (they should be 10 to the power of 3 and 4, respectively).
6. Try to mark up at least two appropriate words in the text with strong importance/emphasis.
7. There are two places where the letter should have a hyperlink. Add appropriate links with titles. For the location that the links point to, you may use http://example.com as the URL.
8. Mark up the university motto quote and citation with appropriate elements.

### The head of the document
1. The character set of the document should be set as utf-8 using the appropriate meta tag.
2. The author of the letter should be specified in an appropriate meta tag.
3. The provided CSS should be included inside an appropriate tag.

### Hints and tips
Use the W3C HTML validator to validate your HTML. Award yourself bonus points if it validates.
You don't need to know any CSS to do this assignment. You just need to put the provided CSS inside an HTML element.