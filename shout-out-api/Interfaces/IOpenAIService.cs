namespace shout_out_api.Interfaces
{
    public interface IOpenAIService
    {
        Task<string> GetResponseFromOpenAI(string input, CancellationToken cancellationToken);
    }
}
