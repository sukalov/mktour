import { redirect } from 'next/navigation';

export default function MyTournamentsPage() {
  redirect('/tournaments/all');
}
