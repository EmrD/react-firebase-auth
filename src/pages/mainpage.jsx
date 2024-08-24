import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNote, getNotes, updateNote, deleteNote, logout } from "../firebase";
import toast from "react-hot-toast";

export default function MainPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notes, setNotes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: "", content: "" });

  useEffect(() => {
    const fetchNotes = async () => {
      if (user == "false" || user == false) {
        toast.error("Yetkisiz erişim tespit edildi. Lütfen giriş yapın!");
        navigate("/login");
      } else {
        const userNotes = await getNotes(user.uid);
        setNotes(userNotes);
        localStorage.setItem("user", JSON.stringify(user));
      }
    };

    fetchNotes();
  }, [user, navigate]);

  const handleAddNote = () => {
    setCurrentNote({ id: null, title: "", content: "" });
    setIsModalOpen(true);
  };

  const handleEditNote = (id, note) => {
    setCurrentNote({ id, ...note });
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(user.uid, id);
    setNotes((prevNotes) => {
      const newNotes = { ...prevNotes };
      delete newNotes[id];
      return newNotes;
    });
  };

  const handleSaveNote = async () => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      toast.error("Başlık ve içerik alanları boş bırakılamaz");
      return;
    }

    if (currentNote.id) {
      await updateNote(user.uid, currentNote.id, currentNote);
      setNotes((prevNotes) => ({
        ...prevNotes,
        [currentNote.id]: { title: currentNote.title, content: currentNote.content },
      }));
    } else {
      const newNoteId = await addNote(user.uid, currentNote);
      setNotes((prevNotes) => ({
        ...prevNotes,
        [newNoteId]: { title: currentNote.title, content: currentNote.content },
      }));
    }
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    dispatch({ type: "auth/logoutSuccess" });
    navigate("/login");
    toast.success("Çıkış Yapıldı")
    localStorage.removeItem("user");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="fixed top-4 right-4 flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-semibold">{user?.email}</p>
          <p className="text-xs text-gray-500">Kullanıcı Kimliği: {user?.uid}</p>
        </div>
        <button
          className="h-8 rounded px-4 text-sm text-white bg-indigo-700 hover:bg-indigo-600"
          onClick={handleLogout}
        >
          Çıkış Yap
        </button>
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Notlarınız</h1>
            <button
              className="h-8 rounded px-4 text-sm text-white bg-indigo-700 hover:bg-indigo-600"
              onClick={handleAddNote}
            >
              Not Ekle
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(notes).length === 0 ? (
              <h1 className="text-xl font-semibold text-gray-600 mx-auto">Henüz not eklenmemiş.</h1>
            ) : (
              Object.entries(notes).map(([id, note]) => (
                <div key={id} className="bg-gray-100 p-4 rounded-lg shadow-sm border-2 border-blue-500">
                  <h2 className="font-semibold text-lg">{note.title}</h2>
                  <p className="text-gray-600">{note.content}</p>
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      className="h-8 rounded px-4 text-sm text-white bg-indigo-700 hover:bg-indigo-600"
                      onClick={() => handleEditNote(id, note)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="h-8 rounded px-4 text-sm text-white bg-red-700 hover:bg-red-600"
                      onClick={() => handleDeleteNote(id)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{currentNote.id ? "Not Düzeltme" : "Yeni Not Girişi"}</h2>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Başlık"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="İçerik"
              value={currentNote.content}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="h-8 rounded px-4 text-sm text-white bg-gray-500 hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                İptal
              </button>
              <button
                className="h-8 rounded px-4 text-sm text-white bg-indigo-700 hover:bg-indigo-600"
                onClick={handleSaveNote}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
