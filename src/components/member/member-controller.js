import memberService from './member-service.js';

const checkIfImagesExist = (requestFiles) => {
  if (requestFiles === undefined || requestFiles === null) {
    return undefined;
  }

  for (let index = 0; index < Object.keys(requestFiles).length; index++) {
    if (Object.keys(requestFiles)[index] === 'image') {
      return requestFiles.image;
    }
  }
  return undefined;
};

const createMember = async (req, res, next) => {
  try {
    const images = checkIfImagesExist(req.files);
    const result = await memberService.createMember(req.body, images);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const showMembers = async (req, res, next) => {
  try {
    const result = await memberService.getMembers();
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const showSingleMember = async (req, res, next) => {
  try {
    const memberId = req.params.memId ?? undefined;
    const result = await memberService.getSingleMember(memberId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const images = checkIfImagesExist(req.files);

    const memberId = req.params.memId ?? undefined;
    const result = await memberService.updateMember(req.body, images, memberId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const memberId = req.params.memId ?? undefined;
    const result = await memberService.deleteMember(memberId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createMember,
  showMembers,
  showSingleMember,
  updateMember,
  deleteMember,
};
