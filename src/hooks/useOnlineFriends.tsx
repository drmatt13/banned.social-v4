import { useState, useEffect } from "react";
import type User from "@/types/user";

// data
import avatarOrder from "@/data/avatarOrder";

const placeholderNames = [
  "Rylie Davidson",
  "Dante Hanson",
  "Mariana Jones",
  "William Maddox",
  "Zainab Powers",
  "Sean Holland",
  "Mariah Gallegos",
  "Jonas Yu",
  "Navy Novak",
  "Bishop Nelson",
  "Everly Mata",
  "Ray Brennan",
  "Elodie Hodges",
  "Alonzo Singh",
  "Vivienne Salinas",
  "Edgar Silva",
  "Lucia Sanchez",
  "Joseph Hubbard",
  "Rosie Salas",
  "Zaiden Rogers",
  "Rylie Davidson",
  "Dante Hanson",
  "Mariana Jones",
  "William Maddox",
  "Zainab Powers",
  "Sean Holland",
  "Mariah Gallegos",
  "Jonas Yu",
  "Navy Novak",
  "Bishop Nelson",
  "Everly Mata",
  "Ray Brennan",
  "Elodie Hodges",
  "Alonzo Singh",
  "Vivienne Salinas",
  "Edgar Silva",
  "Lucia Sanchez",
  "Joseph Hubbard",
  "Rosie Salas",
  "Zaiden Rogers",
];

const useOnlineFriends = (user: User) => {
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [loadingOnlineFriends, setLoadingOnlineFriends] = useState(true);

  useEffect(() => {
    if (user) {
      const randomAvatar = () => {
        const randomIndex = Math.floor(Math.random() * avatarOrder.length);
        return avatarOrder[randomIndex];
      };
      const testUsers = placeholderNames.map((username) => {
        return {
          id: name,
          username,
          avatar: randomAvatar(),
        };
      });
      console.log(testUsers);
      setOnlineFriends(testUsers as unknown as User[]);
    }
  }, [user]);

  return {
    onlineFriends,
    setOnlineFriends,
    loadingOnlineFriends,
  };
};

export default useOnlineFriends;
