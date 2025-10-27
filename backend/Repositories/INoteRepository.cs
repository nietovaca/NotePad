using NotePadApi.Models;

namespace NotePadApi.Repositories
{
    public interface INoteRepository
    {
        IEnumerable<Note> GetAllByUserId(string userId);
        Note? GetById(Guid id, string userId);
        Note Add(Note note);
        bool Update(Note note);
        bool Delete(Guid id, string userId);
    }
}
