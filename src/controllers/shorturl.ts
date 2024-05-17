import {Request, Response} from "express";
import { urlModel } from "../models/shorturl";
import metaFetcher from 'meta-fetcher';

// @desc Get all short Urls
// @route GET /short-url
// @access Private [user]
export const getAllUrl = async (req: Request, res: Response) => {
    try {

        const userId = req.userId;

        const shortUrls = await urlModel.find({userId});
        res.json({count: shortUrls.length, shortUrls});
        // res.json({count: 0, shortUrls: []});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};

// @desc Create new short url
// @route POST /short-url
// @access Private [user]
export const createUrl = async (req: Request, res: Response) => {
    try {
        const fullUrl = req.body.url;
        const userId = req.userId;
        
        if (!fullUrl) {
            return res.status(400).json({message: "Missing Fields: 'url'"});
        }

        const urlExists = await urlModel.findOne({fullUrl, userId});

        if (urlExists) {
            return res.status(409).json({message: "URL already exists"});
        }

        const metadata = await metaFetcher(fullUrl);

        const shortUrl = await urlModel.create({fullUrl, userId, title: metadata.metadata.title, imageUrl: metadata.favicons.at(0)});
        res.status(201).json({message: "URL created successfuly", shortUrl})

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};


// @desc Get short Url by id
// @route GET /short-url/:id
// @access Private [user]
export const getShortUrl = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const userId = req.userId;

        const url = await urlModel.findOne({_id: id, userId});

        if (!url) {
            return res.status(404).json({message: "Requested URL not found"});
        }

        res.json({shortUrl: url});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};


// @desc Update short Url by id
// @route PATCH /short-url/:id
// @access Private [user]
export const updateUrl = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;
        const userId = req.userId;
        let newTitle = req.body.title;

        const shortUrl = await urlModel.findOne({_id: id, userId});

        if (!shortUrl) {
            return res.status(404).json({message: "Requested URL not found"});
        }

        if (!newTitle) {
            const metadata = await metaFetcher(shortUrl.fullUrl);
            newTitle = metadata.metadata.title;
        }

        shortUrl.title = newTitle;
        await shortUrl.save();

    
        res.status(200).send({message: "Requested URL updated successfully", shortUrl});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};

// @desc Toggle favorite
// @route PUT /short-url/:id/favorite
// @access Private [user]
export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        
        const id = req.params.id;  
        const userId = req.userId;

        const shortUrl = await urlModel.findOne({_id: id, userId});

        if (!shortUrl) {
            return res.status(404).json({message: "Requested URL not found"});
        }

        shortUrl.favorite = !shortUrl.favorite;
        await shortUrl.save();
    
        res.status(200).send({message: "Requested URL updated successfully", shortUrl});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

// @desc Toggle archived
// @route PUT /short-url/:id/archived
// @access Private [user]
export const toggleArchived = async (req: Request, res: Response) => {
    try {
        
        const id = req.params.id;  
        const userId = req.userId;

        const shortUrl = await urlModel.findOne({_id: id, userId});

        if (!shortUrl) {
            return res.status(404).json({message: "Requested URL not found"});
        }

        shortUrl.archived = !shortUrl.archived;
        await shortUrl.save();

    
        res.status(200).send({message: "Requested URL updated successfully", shortUrl});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

// @desc Fetch custom url
// @route POST /short-url/custom
// @access Private [user]
export const checkCustomCodeAvailability = async (req: Request, res: Response) => {
    try {
        
        const { customCode } = req.body;
        
        if (!customCode) {
            return res.status(400).send({message: "Missing Fields: 'customCode"});
        }

        const urlExists = await urlModel.findOne({customCode});

        if (urlExists) {
            return res.status(409).send({message: "Provided custom code is not available"});
        }
        
        return res.status(200).send({message: "Custom code available"});
        

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

// @desc Fetch custom url
// @route PATCH /short-url/:id/custom
// @access Private [user]
export const updateCustomCode = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const newCustomCode = req.body.customCode;
        
        if (!newCustomCode) {
            return res.status(400).send({message: "Missing Fields: 'customCode"});
        }

        const currentUrl = await urlModel.findOne({_id: id, userId});

        if (!currentUrl) {
            return res.status(404).json({message: "Requested URL not found"});
        }

        const existingUrl = await urlModel.findOne({customCode: newCustomCode});

        if (existingUrl && existingUrl.id !== id) {
            return res.status(409).send({message: "Custom code already exists"});
        }

        currentUrl.customCode = newCustomCode;
        await currentUrl.save();
        
        res.status(200).send({message: "Requested URL updated successfully", currentUrl});
        

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

// @desc Delete short Url by id
// @route DELETE /short-url/:id
// @access Private [user]
export const deleteUrl = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;
        const userId = req.userId;
        const url = await urlModel.findOneAndDelete({_id: id, userId});

        if (!url) {
            return res.status(404).send({message: "Requested URL not found"});
        }

        res.status(200).send({message: "Requested URL deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};

// @desc Redirect to full url
// @route GET /short-url/redirect/:code
// @access Public
export const redirectToUrl = async (req: Request, res: Response) => {
    try {
        const {code} = req.params;
        const url = await urlModel.findOne({$or: [{shortCode: code}, {customCode: code}] });

        if (!url) {
            return res.status(404).json({message: "Requested URL not found"});
        }
        
        if (url.archived) {
            return res.status(404).json({message: "Requested URL not found"});
        }        

        url.clicks++;
        url.save();
        res.redirect(`${url.fullUrl}`);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};