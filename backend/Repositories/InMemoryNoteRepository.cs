using NotePadApi.Models;
using System.Collections.Concurrent;

namespace NotePadApi.Repositories
{
    //purpose: to store and retrieve notes in memory
    //it is used to store the notes in a thread-safe collection
    //it is used to retrieve the notes from the collection
    //it is used to add, update, and delete notes from the collection

    public class InMemoryNoteRepository : INoteRepository
    {
        // ConcurrentBag is a thread-safe collection that is used to store the notes
        private static readonly ConcurrentBag<Note> _notes = new ConcurrentBag<Note>();

        //get all notes for a user by user id and return them as a list
        public IEnumerable<Note> GetAllByUserId(string userId) => 
            _notes.Where(n => n.UserId == userId).ToList();

        //get a note by id and user id and return it as a note object
        public Note? GetById(Guid id, string userId) => 
            _notes.FirstOrDefault(n => n.Id == id && n.UserId == userId);

        //add a note to the collection
        public Note Add(Note note)
        {
            _notes.Add(note);
            return note;
        }

        //update a note in the collection
        public bool Update(Note updatedNote)
        {
            // Since ConcurrentBag doesn't support direct updates, we need to create a new collection
            var notesToKeep = _notes.Where(n => n.Id != updatedNote.Id || n.UserId != updatedNote.UserId).ToList();
            
            // Clear and repopulate the collection
            _notes.Clear();
            foreach (var note in notesToKeep)
            {
                _notes.Add(note);
            }
            
            _notes.Add(updatedNote);
            return true;
        }

        //delete a note from the collection
        public bool Delete(Guid id, string userId)
        {
            var notesToKeep = _notes.Where(n => n.Id != id || n.UserId != userId).ToList();
            
            // if the count of the notes to keep is the same as the count of the notes, nothing was removed
            if (notesToKeep.Count == _notes.Count)
                return false;
            
            // clear and repopulate the collection
            _notes.Clear();
            foreach (var note in notesToKeep)
            {
                _notes.Add(note);
            }
            
            return true;
        }
    }
}
