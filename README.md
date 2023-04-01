# ChatGPT Long Article Assistant

This website is designed to assist users in inputting long articles into ChatGPT by breaking them into smaller, manageable conversations. Users can input their task prompt and article, configure the maximum tokens per conversation, and the tool will generate a series of formatted text boxes ready for use with ChatGPT. This makes it easy to work with longer articles without exceeding the token limitations.

## Features

- Break long articles into smaller, manageable conversations for ChatGPT.
- Customizable maximum tokens per conversation.
- User-friendly interface with editable input and output text boxes.
- Responsive design suitable for various devices and screen sizes.
- Anomaly detection feature (requires OpenAI API key) to identify irregularities in the output text.

## How to Use

1. Visit the website and input your task prompt in the "Task Prompt" text box. For example "Summarize the article for me".
2. Paste your long article into the "Input Article" text box.
3. Configure the maximum tokens per conversation using the slider.
4. Click the "Convert" button to create the formatted text boxes.
5. If you wish to enable the anomaly detection feature, input your OpenAI API key in the designated text box.
6. Review and edit the generated text boxes as needed before using them with ChatGPT.

## Notes

- The OpenAI API key is stored in the browser cache for a seamless experience on future visits.
- The anomaly detection feature requires a valid OpenAI API key and will be disabled if no API key is provided.

## Future Work

The current version of the ChatGPT Long Article Assistant requires users to manually copy and paste the formatted text boxes into ChatGPT. To further enhance the user experience and streamline the process, the following features are being considered for future development:

1. **Direct integration with OpenAI API**: Implement a feature that allows users to connect their OpenAI API key directly to the web application. This would enable automatic submission of the formatted text boxes to ChatGPT without the need for manual copy-pasting.

2. **Automated retrieval of ChatGPT responses**: Once integrated with the OpenAI API, the web application could automatically retrieve and display ChatGPT's responses for each conversation segment. This would allow users to view and review the generated output within the same interface.


## Contributing

Feel free to submit issues, fork the repository and submit pull requests to improve the tool. Your contributions are appreciated.
