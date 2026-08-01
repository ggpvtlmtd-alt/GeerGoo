from parser import LogParser
from prompt_builder import PromptBuilder
from gemini_client import GeminiClient


class LogAnalyzer:

    def __init__(self, file_path, api_key):
        self.file_path = file_path
        self.client = GeminiClient(api_key)

    def analyze(self):

        parser = LogParser(self.file_path)

        parsed_data = parser.parse()

        prompt = PromptBuilder.build(parsed_data)

        result = self.client.analyze(prompt)

        return {
            "parsed_data": parsed_data,
            "analysis": result
        }