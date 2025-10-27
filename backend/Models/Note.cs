using System.ComponentModel.DataAnnotations;

namespace NotePadApi.Models
{
    public class Note
    {
        public Guid Id { get; set; }
        
        public string UserId { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
    }
} 