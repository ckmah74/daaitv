/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Channel {
  id: string;
  name: string;
  videoUrl: string;
  embedId: string;
  category: string;
  subtitle: string;
  description: string;
  thumbnail: string;
}

export interface Program {
  title: string;
  time: string;
  duration: number;
  category: "Humanism" | "Education" | "News" | "Vegetarian" | "Drama" | "Wisdom";
  host: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  location: string;
  category: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  iconName: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
