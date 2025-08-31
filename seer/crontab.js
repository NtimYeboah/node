// What is so special about crontab
// crontab - maintain crontab files for individual users

// Usage of the crontab command - man crontab
    // usage
    // crontab -u {user} {file} => file, specifies the location of the file used to populate the crontab
    // crontab -u {user} {-l | -r | -e }

//1. Validate the permission of the current user when you initialize the crontab class
    //1. Use the process to identify the current user
    //2. Get the deny list of cron users - based on the current system
    //3. Grep and check whether the user is on the deny list and deny

//2. read the entries in the crontab

import { env } from 'node:process'
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'

class Crontab {
    constructor() {

        // Validate whether current user can interact with the crontab
        this.canInteractWith()
    }

    canInteractWith() {
        const user = env.USER
        return this.isDenied(user) === false || this.isAllowed(user) === true;
    }

    /**
     * Add new entry to the crontab.
     * 
     * @param {string} period 
     * @param {string} filePath 
     * @returns Boolean
     */
    async addEntry(period, filePath) {
        let entries = await this.read()
  
        code = await this.write(period, filePath, entries)

        return code === 0;
    }

    /**
     * Write entries to the crontab.
     * 
     * @param {string} period 
     * @param {string} filePath 
     * @param {string} entries 
     * @returns Boolean
     */
    write(period, filePath, entries) {
        return new Promise((resolve, reject) => {
            const tab = spawn('crontab', ['-'])
            tab.on('error', (error) => {
                reject(new Error(`Couldn't initialize crontab: ${error.message}`))
            })

            let entry = `${period} ${env.argv[0]} ${filePath} >> dev/null\n`
            entries += entry

            tab.stdin.write(entries)
            tab.stdin.end()

            let errors = ''
            tab.stderr.on('data', (data) => {
                errors += data.toString()
            })

            tab.on('close', (code) => {
                if (code === 0) {
                    resolve(code)
                } else {
                    reject(new Error(`Command failed with code ${code}\nErrors: ${errors}`))
                }
            })
        })
    }

    /**
     * Reads the crontab entries.
     * @returns String
     */
    read() {
        return new Promise((resolve, reject) => {
            const tab = spawn('crontab', ['-l'])
            tab.on('error', (error) => {
                reject(new Error(`Couldn't initialize crontab: ${error.message}`))
            })

            let entries = ''
            let errors = ''
            tab.stdout.on('data', (data) => {
                entries += data.toString()
            })
            tab.stderr.on('data', (data) => {
                errors += data.toString()
            })

            tab.on('close', (code) => {
                if (code === 0) {
                    resolve(entries)
                } else {
                    reject(new Error(`Command failed with code ${code}\nErrors: ${errors}`))
                }
            })
        })
    }

    /**
     * Determine whether user is denied access to the crontab.
     * 
     * @param {string} user 
     * @returns Boolean
     */
    async isDenied(user) {
        const filePath = '/usr/lib/cron/cron.deny'

        try {
            const users = await readFile(filePath, 'utf-8')

            if (users.match(`/[${user}]/g`) !== null) {
                throw new Error(`User ${user} is not allowed to interact with crontab`)
            }

            return false
        } catch (error) {
            if (error.code === 'ENOENT') {
                return false
            }

            throw error
        }
    }

    /**
     * Determine whether user is allowed access to the crontab.
     * 
     * @param {string} user 
     * @returns Boolean
     */
    async isAllowed(user) {
        const filePath = '/usr/lib/cron/cron.allow'

        try {
            const users = await readFile(filePath, 'utf-8')

            if (users.match(`/[${user}]/g`) !== null) {
                return true
            }

            return false
        } catch (error) {
            if (error.code === 'ENOENT') {
                return true
            }

            throw error
        }
    }
}

module.exports = new Crontab()