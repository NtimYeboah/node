/* const scheduler = (function () {
    // when schedule is called, it will add an entry into the crontab
    function schedule(period, callable) {
        // Make an entry into the crontab of the system
    }
    return {
        schedule: schedule
    }
})() */

//const { scheduler } from "seer"

/* scheduler.schedule(period, () => {

})

scheduler.schedule(period, () => {

}).queue() */
import { writeFile } from 'node/fs/promises'
import { path } from 'node:path'
import { argv } from 'node:process'
import { Crontab } from './crontab'

class Scheduler {
    schedule(period, callable, options) { 
        const paths = argv[1].split(path.sep)
        const moduleName = paths.at(-2)
        const filePath = `${moduleName}_${Date.now()}`
    
        // put the entry files in the usr/bin/lib or somewhere similar
        // but for testing, put it in the current directory
        this.createEntry(filePath, callable)

        // Write entry to the crontab
        Crontab.addEntry(period, filePath)
    }

    async createEntry(filePath, callable) {
        const content = `#!${process.argv[0]}\n(${callable})()`
        
        return await writeFile(filePath, content);
    }
}

module.exports = new Scheduler
