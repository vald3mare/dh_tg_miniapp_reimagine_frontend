import * as m from 'motion/react-m'

const PageTransition = ({ children }) => (
  <m.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10, transition: { duration: 0.15, ease: 'easeIn' } }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </m.div>
)

export default PageTransition
