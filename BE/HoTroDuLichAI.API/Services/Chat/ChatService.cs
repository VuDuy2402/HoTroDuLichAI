using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class ChatService : IChatService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly ILogger<ChatService> _logger;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatService(
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            ILogger<ChatService> logger,
            IHubContext<ChatHub> hubContext
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;
            _hubContext = hubContext;
        }

        public async Task<ApiResponse<List<MessageDetailResponseDto>>> GetMyConversationsAsync(GetMessageChatRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<List<MessageDetailResponseDto>>();
            var errors = new List<ErrorDetail>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Success = false;
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var receiverExist = await _userManager.FindByIdAsync(requestDto.ReceiverId.ToString());
                if (receiverExist == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                string senderImage = currentUser.ImageProperties.Where(img => img.ImageType == CImageType.Avatar
                    && img.IsDefault).Select(img => img.Url).FirstOrDefault() ?? string.Empty;
                string receiverImage = receiverExist.ImageProperties.Where(img => img.ImageType == CImageType.Avatar
                    && img.IsDefault).Select(img => img.Url).FirstOrDefault() ?? string.Empty;
                var messages = await _dbContext.Messages.Include(m => m.Receiver).Include(m => m.Sender)
                    .Where(m => (m.SenderId == currentUser.Id && m.ReceiverId == receiverExist.Id)
                        || (m.ReceiverId == currentUser.Id && m.SenderId == receiverExist.Id))
                    .OrderBy(item => item.SendDate)
                    .Select(item => new MessageDetailResponseDto
                    {
                        UserId = item.SenderId == currentUser.Id ? currentUser.Id : receiverExist.Id,
                        FullName = item.SenderId == currentUser.Id ? currentUser.FullName : receiverExist.FullName,
                        Email = item.SenderId == currentUser.Id ? currentUser.Email ?? string.Empty : receiverExist.Email ?? string.Empty,
                        Picture = item.SenderId == currentUser.Id ? senderImage : receiverImage,
                        Message = item.Content,
                        SendDate = item.SendDate,
                        IsSender = item.SenderId == currentUser.Id
                    }).ToListAsync();
                response.Result.Data = messages;
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<bool>> SendMessageAsync(SendMessageRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<bool>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không đúng định vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.FormSummary
                });
                response.Result.Success = false;
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }

            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }

            var currentUser = RuntimeContext.CurrentUser;
            if (currentUser == null)
            {
                return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
            }

            try
            {
                var messageEntity = new MessageEntity()
                {
                    Content = requestDto.Message,
                    ReceiverId = requestDto.ReceiverId,
                    SenderId = currentUser.Id,
                    Status = CSendMessageStatus.Sended
                };

                _dbContext.Messages.Add(entity: messageEntity);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation($"SignalR bắt đầu gửi tin nhắn đến người dùng : UserId = '{requestDto.ReceiverId}'");
                await _hubContext.Clients.User(requestDto.ReceiverId.ToString())
                    .SendAsync("ReceivePrivateMessage", requestDto.ReceiverId.ToString(), requestDto.Message);
                response.Result.Data = true;
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status201Created;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
    }
}