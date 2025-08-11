'use client';
import produce from '../data/produce.json';
import FullRelishSeasonal from '../components/FullRelishSeasonal';

export default function Page() {
  return <FullRelishSeasonal produce={produce} />;
}
