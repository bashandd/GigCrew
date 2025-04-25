
import type { ObjectId } from 'mongodb';

/**
 * Represents a job posting structure, compatible with MongoDB.
 */
export interface Job {
  /**
   * The unique identifier for the job (MongoDB ObjectId).
   */
  _id?: ObjectId; // Use _id for MongoDB
  /**
   * The title of the job.
   */
  title: string;
  /**
   * The description of the job.
   */
  description: string;
  /**
   * The company posting the job.
   */
  company: string;
  /**
   * The location of the job.
   */
  location: string;
  /**
   * The salary range for the job.
   */
  salary: string;
  /**
   * The type of job (e.g., full-time, part-time). Optional.
   */
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  /**
   * The required experience level. Optional.
   */
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'manager';
  /**
   * Date the job was posted. Optional.
   */
  datePosted?: Date;
}
