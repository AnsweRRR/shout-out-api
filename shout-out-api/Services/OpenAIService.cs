using OpenAI_API.Completions;
using OpenAI_API;
using shout_out_api.Helpers;
using shout_out_api.Interfaces;
using OpenAI_API.Chat;

namespace shout_out_api.Services
{
    public class OpenAIService: IOpenAIService
    {
        private readonly ConfigHelper _configHelper;
        public OpenAIService(ConfigHelper configHelper)
        {
            _configHelper = configHelper;
        }

        public async Task<string> GetResponseFromOpenAI(string input, CancellationToken cancellationToken)
        {
            try
            {
                string apiKey = _configHelper.OpenAI.ApiKey;
                string response = string.Empty;

                OpenAIAPI openAI = new OpenAIAPI(apiKey);
                CompletionRequest completion = new CompletionRequest()
                {
                    Prompt = input,
                    Model = "text-davinci-003",
                    MaxTokens = 4000
                };

                var output = await openAI.Completions.CreateCompletionAsync(completion);

                if (output != null)
                {
                    foreach (var item in output.Completions)
                    {
                        response = item.Text;
                    }

                    return response;
                }
                else
                {
                    throw new Exception("Not found!");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> GetChatResponseFromOpenAI(string input, CancellationToken cancellationToken)
        {
            try
            {
                string apiKey = _configHelper.OpenAI.ApiKey;
                ChatMessage chatMessage = new ChatMessage();

                OpenAIAPI openAI = new OpenAIAPI(apiKey);

                ChatRequest chatRequest = new ChatRequest()
                {
                    Model = "gpt-3.5-turbo-1106",
                    Temperature = 0.1,
                    MaxTokens = 4000,
                    Messages = new ChatMessage[] {
                        new ChatMessage(ChatMessageRole.User, input)
                    }
                };

                var output = await openAI.Chat.CreateChatCompletionAsync(chatRequest);

                if (output != null)
                {
                    foreach (var item in output.Choices)
                    {
                        chatMessage = item.Message;
                    }

                    return chatMessage.Content;
                }
                else
                {
                    throw new Exception("Not found!");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
