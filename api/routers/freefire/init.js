const application = require('../../database/models/application');

async function init(req, res) {
  try {
    const { version, applicationId } = req.query;
    const userAgent = req.headers['user-agent'];

    if (userAgent != 'know')
      return res.status(401).json({ message: 'Unauthorized' });
    if (!version || !applicationId)
      return res.status(400).json({ message: 'Params undefined' });

    const findApplication = await application.findById(applicationId);
    if (!findApplication)
      return res.status(404).json({ message: 'Application not found' });

    if (version != findApplication.ffversion)
      return res.status(401).json({ message: 'Version not match' });

    return res
      .status(200)
      .json({ message: 'Initialized', key: findApplication.key });
  } catch {
    return res.status(500).json({ message: 'invalid error' });
  }
}

module.exports = init;
