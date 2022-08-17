/** @jsx h */
import { h } from 'preact'
import { PageProps } from '$fresh/server.ts'
import { tw } from '@twind'

export default function Greet(props: PageProps) {
  return <h1 class={tw`text-2xl text-center mb-4`}>Success</h1>
}
