import FormatText from './FormatText'

/* eslint-disable react/prop-types */
const FormatImage = ({ imageurl, text, messageId, expandedMessages, setExpandedMessages }) => {
  return (
    <section className='flex flex-col gap-2'>
      <img src={imageurl} alt='imagen' className='max-w-auto h-[80%] rounded-md' />
      <FormatText text={text} messageId={messageId} expandedMessages={expandedMessages} setExpandedMessages={setExpandedMessages} />
    </section>
  )
}
export default FormatImage
