import * as core from '@actions/core'
import { wait } from './wait'
import * as fs from 'fs'
import archiver from 'archiver'
import * as path from 'path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // const ms: string = core.getInput('milliseconds')
    const sb_input: string = core.getInput('sb_input')
    console.log('console log message')
    console.log(`sb_input is  ${sb_input}`)

    const repoPath = process.env.GITHUB_WORKSPACE as string
    console.log(`repo path is ${repoPath}`)

    const files = fs.readdirSync(repoPath)

    // Print the names of all files
    console.log('----------FILES IN CHECKOUT OUT REPO---------------')
    for (const file of files) {
      core.info(`Checked-out file: ${file}`)
    }

    console.log('trying to zip the repo')
    const output = fs.createWriteStream(path.join(process.cwd(), 'project.zip'))
    const archive = archiver('zip')

    archive.pipe(output)
    archive.directory(repoPath, false)
    archive.finalize()

    console.log(`current path is ${process.cwd()}`)
    // Print the names of all files
    console.log(
      '----------FILES IN current folder, is there a zip?---------------'
    )
    for (const file of fs.readdirSync(process.cwd())) {
      core.info(`Current folder file: ${file}`)
    }

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    // core.debug(`Waiting ${ms} milliseconds ...`)
    // core.debug(`this is me sb sb sb`)
    // console.log(`SB SB Waiting ${ms} milliseconds ...`)
    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt('1000', 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
    core.setOutput('sb_output', sb_input)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
