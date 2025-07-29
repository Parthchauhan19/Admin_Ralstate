// // import React, { createContext, useContext, useState, useEffect } from "react";

// // interface User {
// //   id: string;
// //   name: string;
// //   email: string;
// //   role: "admin" | "manager" | "agent";
// //   avatar?: string;
// // }

// // interface AuthContextType {
// //   user: User | null;
// //   login: (email: string, password: string) => Promise<boolean>;
// //   logout: () => void;
// //   isLoading: boolean;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
// //   children,
// // }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const storedUser = localStorage.getItem("user");
// //     if (storedUser) {
// //       try {
// //         setUser(JSON.parse(storedUser));
// //       } catch {
// //         localStorage.removeItem("user");
// //       }
// //     }
// //     setIsLoading(false);
// //   }, []);

// //   const login = async (email: string, password: string): Promise<boolean> => {
// //     setIsLoading(true);

// //     await new Promise((resolve) => setTimeout(resolve, 1000));

// //     const userMap: Record<string, { password: string; data: User }> = {
// //       "ochireality@Admin.com": {
// //         password: "admin123",
// //         data: {
// //           id: "01_PN1072003",
// //           name: "Parth Chauhan",
// //           email: "ochireality@Admin.com",
// //           role: "admin",
// //           avatar:
// //             "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
// //         },
// //       },
// //       "ochireality@Admin2.com": {
// //         password: "admin456",
// //         data: {
// //           id: "02_NP1982004",
// //           name: "Nency Bhuva",
// //           email: "ochireality@Admin2.com",
// //           role: "admin",
// //           avatar:
// //             "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
// //         },
// //       },
// //     };

// //     const account = userMap[email];
// //     if (account && account.password === password) {
// //       setUser(account.data);
// //       localStorage.setItem("user", JSON.stringify(account.data));
// //       setIsLoading(false);
// //       return true;
// //     }

// //     setIsLoading(false);
// //     return false;
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     localStorage.removeItem("user");
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "manager" | "agent";
//   avatar?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch {
//         localStorage.removeItem("user");
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true);
//     try {
//       const res = await axios.post("http://localhost:8000/user/login", {
//         email,
//         password,
//       });

//       const userData: User = res.data.data;
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));

//       return true;
//     } catch (err: any) {
//       console.error(
//         "Login failed:",
//         err.response?.data?.message || err.message
//       );
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
