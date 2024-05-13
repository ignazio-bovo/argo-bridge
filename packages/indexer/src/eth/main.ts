import { handleEvmBridgeEvents } from "./bridge"
import { ARGO_ADDRESS, TIMELOCK_ADDRESS, processor } from "./processor"
import { handleTimelockEvents } from "./timelock"
import { EvmLog } from "./types"
import { TypeormDatabase } from "@subsquid/typeorm-store"

processor.run(
  new TypeormDatabase({ supportHotBlocks: true, stateSchema: "eth_processor" }),
  async (ctx) => {
    const bridgeLogs: EvmLog[] = []
    const timelockLogs: EvmLog[] = []

    for (const block of ctx.blocks) {
      for (const log of block.logs) {
        if (log.address === ARGO_ADDRESS) {
          bridgeLogs.push(log)
        }
        if (log.address === TIMELOCK_ADDRESS) {
          timelockLogs.push(log)
        }
      }
    }

    await handleEvmBridgeEvents(bridgeLogs, ctx.store)
    await handleTimelockEvents(timelockLogs, ctx)
  },
)
