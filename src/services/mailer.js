export function sendMessage(primaryProvider, secondaryProvider) {
  return async function(sender, recipient, subject, content) {
    const primaryResponse = await primaryProvider(
      sender,
      recipient,
      subject,
      content
    );

    // If primary provider fail to send request, swith to secondary provider
    if (primaryResponse.errorMessage) {
      const secondaryResponse = await secondaryProvider(
        sender,
        recipient,
        subject,
        content
      );
      return { ...secondaryResponse, provider: 'secondary' };
    }

    return { ...primaryResponse, provider: 'primary' };
  };
}
