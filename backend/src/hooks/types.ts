import { LifecycleHook, LifecycleHookLookup } from 'fastify/types/hooks'

export type Hook<
  TStage extends LifecycleHook,
  THandler extends LifecycleHookLookup<TStage> = LifecycleHookLookup<TStage>
> = {
  handler: THandler
  stage: TStage
}
