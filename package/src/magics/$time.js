const MINUTES_IN_SECONDS = 60
const HOURS_IN_SECONDS = 60 * MINUTES_IN_SECONDS
const DAYS_IN_SECONDS = 24 * HOURS_IN_SECONDS
const WEEKS_IN_SECONDS = 7 * DAYS_IN_SECONDS
const MONTHS_IN_SECONDS = 30.4167 * DAYS_IN_SECONDS
const YEARS_IN_SECONDS = 365.25 * DAYS_IN_SECONDS

const $time = () => ({
   diff(from, to = 0) {
      if (to === 0) {
         to = Date.now()
      }

      if (typeof from === 'string') {
         from = Date.parse(from)
      }

      const diff = Number.parseInt(Math.abs(to - from) / 1000)
      let amount
      let metric

      if (diff < MINUTES_IN_SECONDS) {
         amount = diff
         metric = 'seconds'
      } else if (diff < HOURS_IN_SECONDS && diff >= MINUTES_IN_SECONDS) {
         amount = Math.round(diff / MINUTES_IN_SECONDS)
         metric = 'minutes'
      } else if (diff < DAYS_IN_SECONDS && diff >= HOURS_IN_SECONDS) {
         amount = Math.round(diff / HOURS_IN_SECONDS)
         metric = 'hours'
      } else if (diff < WEEKS_IN_SECONDS && diff >= DAYS_IN_SECONDS) {
         amount = Math.round(diff / DAYS_IN_SECONDS)
         metric = 'days'
      } else if (diff < MONTHS_IN_SECONDS && diff >= WEEKS_IN_SECONDS) {
         amount = Math.round(diff / WEEKS_IN_SECONDS)
         metric = 'weeks'
      } else if (diff < YEARS_IN_SECONDS && diff >= MONTHS_IN_SECONDS) {
         amount = Math.round(diff / MONTHS_IN_SECONDS)
         metric = 'months'
      } else {
         amount = Math.round(diff / YEARS_IN_SECONDS)
         metric = 'years'
      }

      if (amount <= 1) {
         amount = 1
      }

      return {
         amount,
         metric,
      }
   },

   plus(from, amount, metric = 'days') {
      if (typeof from === 'string') {
         from = Date.parse(from)
      }

      switch (metric) {
         case 'second':
         case 'seconds':
            amount = amount * 1000
            break

         case 'minute':
         case 'minutes':
            amount = amount * MINUTES_IN_SECONDS * 1000
            break

         case 'hour':
         case 'hours':
            amount = amount * HOURS_IN_SECONDS * 1000
            break

         case 'day':
         case 'days':
            amount = amount * DAYS_IN_SECONDS * 1000
            break

         case 'week':
         case 'weeks':
            amount = amount * WEEKS_IN_SECONDS * 1000
            break

         case 'month':
         case 'months':
            amount = amount * MONTHS_IN_SECONDS * 1000
            break

         case 'year':
         case 'years':
            amount = amount * YEARS_IN_SECONDS * 1000
            break

         default:
            break
      }

      return from + amount
   },
})

export default $time
