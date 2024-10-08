import { redirect } from 'next/navigation';

export default function RedirectToBlog() {
  redirect('/blog'); 
  return null;
}
