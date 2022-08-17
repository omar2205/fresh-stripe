/** @jsx h */
import { h } from 'preact'
import { tw } from '@twind'

import { Handlers, PageProps } from '$fresh/server.ts'
import { Head } from 'https://deno.land/x/fresh@1.0.2/runtime.ts'

import { config as Config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
import PayElement from '../islands/PayElement.tsx'

const config = Config({ export: true })

export const handler: Handlers = {
  async GET(req, ctx) {
    return await ctx.render()
  },
}

export default (props: PageProps) => {
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="checkout.css" />
      </Head>
      <h1 class={tw`text-2xl text-center mb-4`}>Payment</h1>
      <PayElement pub_key={config.PUB_KEY} />
    </div>
  )
}