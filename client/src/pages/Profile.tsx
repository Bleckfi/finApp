import { useState } from 'react'

export default function ProfilePage() {
    const [user, setUser] = useState({
        email: 'user@example.com',
        fullName: 'John Doe',
    })

    const [isEditing, setIsEditing] = useState(false)
    const [newName, setNewName] = useState(user.fullName)
    const [passwords, setPasswords] = useState({ current: '', new: '' })

    const handleSave = () => {
        setUser({ ...user, fullName: newName })
        setIsEditing(false)
    }

    const handlePasswordChange = () => {
        console.log('Change password', passwords)
        setPasswords({ current: '', new: '' })
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Профиль</h2>

            <div className="mb-4">
                <label className="block font-medium mb-1 text-gray-700">
                    Почта
                </label>
                <div className="bg-gray-100 px-3 py-2 rounded">
                    {user.email}
                </div>
            </div>

            <div className="mb-6">
                <label className="block font-medium mb-1 text-gray-700">
                    Имя
                </label>
                {isEditing ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="border px-3 py-2 rounded w-full"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Сохранить
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:underline"
                        >
                            Отмена
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <span>{user.fullName}</span>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:underline"
                        >
                            Редактировать
                        </button>
                    </div>
                )}
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Смена пароля</h3>
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">
                        Текущий пароль
                    </label>
                    <input
                        type="password"
                        className="border px-3 py-2 rounded w-full"
                        value={passwords.current}
                        onChange={(e) =>
                            setPasswords({
                                ...passwords,
                                current: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">
                        Новый пароль
                    </label>
                    <input
                        type="password"
                        className="border px-3 py-2 rounded w-full"
                        value={passwords.new}
                        onChange={(e) =>
                            setPasswords({ ...passwords, new: e.target.value })
                        }
                    />
                </div>
                <button
                    onClick={handlePasswordChange}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Обновить пароль
                </button>
            </div>
        </div>
    )
}
