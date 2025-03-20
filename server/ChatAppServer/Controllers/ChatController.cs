using ChatAppServer.Data;
using ChatAppServer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ChatAppServer.Controllers
{
    [Route("api/chat")]
    [ApiController]
    [Authorize]  
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all chat messages
        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _context.ChatMessages.ToListAsync();
            return Ok(messages);
        }

        // Send a new chat message
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessage message)
        {
            if (message == null || string.IsNullOrEmpty(message.Message))
                return BadRequest("Message cannot be empty");

            message.Timestamp = DateTime.UtcNow;
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Message sent successfully!" });
        }
    }
}
